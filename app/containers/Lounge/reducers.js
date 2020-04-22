'use strict';

import { actionTypes } from './actions';
import moment from 'moment';
import { sliderObjSelector } from './constants/config';

export const initialState = {
  videoFilePath: '',
  vCap: null,
  canvasRef: null,
  isPlaying: false,
  frame: null,
  dialog: {
    open: false,
    type: null,
    value: 0,
    maxValue: null
  },
  status: {},
  valueSlider: {
    red: [0, 255],
    green: [0, 255],
    blue: [0, 255],
    gray: [0, 255],
    hue: [0, 255],
    sat: [0, 255],
    val: [0, 255],
    outerX: [0, 1920],
    innerX: [0, 1920],
    outerY: [0, 1440],
    innerY: [0, 1440]
  },
  sliderObj: null,
  progress: null,
  progressFull: null,
  importedFile: null,
  willUpdateNextFrame: false,
  overlayMode: 'none',
  numProcess: 1,
  displayNumProcess: 1,
  queue: [],
  videoDatas: {},
  canvasRefEach: {}
};

const initialConverter = {
  progressFromWorker: null,
  readyToWork: false,
  completeWork: false,
  cancelWork: false
};

export const initialVideoDatas = {
  vCap: null,
  progressFromWorker: null,
  completeWork: false,
  cancelWork: false,
  readyToWork: false
};

function showTime(dur) {
  const h = dur.hours();
  const mm = `${dur.minutes()}`.padStart(2, '0');
  const ss = `${dur.seconds()}`.padStart(2, '0');
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

export default function Lounge(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SELECT_NEW_VIDEO:
      return {
        ...state,
        ...payload,
        isPlaying: false,
        frame: payload.vCap.getFrame(),
        willUpdateNextFrame: true
      };
    case actionTypes.ADD_QUEUE: {
      const paths = [];
      const payloadDatas = {};
      payload.forEach(vCap => {
        paths.push(vCap.path);
        payloadDatas[vCap.path] = {
          ...initialVideoDatas,
          vCap
        };
      });
      return {
        ...state,
        queue: [...state.queue, ...paths],
        videoDatas: { ...state.videoDatas, ...payloadDatas }
      };
    }
    case actionTypes.UPDATE_FRAME:
      return {
        ...state,
        frame: state.vCap.getFrame(),
        willUpdateNextFrame: false
      };
    case actionTypes.SEND_CANVAS:
      return { ...state, canvasRef: payload };
    case actionTypes.START_VIDEO:
      return { ...state, isPlaying: true };
    case actionTypes.HANDLE_OPEN_DIALOG:
      return { ...state, dialog: payload };
    case actionTypes.HANDLE_CANCEL_DIALOG:
    case actionTypes.HANDLE_CONFIRM_DIALOG:
      return { ...state, dialog: initialState.dialog };
    case actionTypes.HANDLE_CHANGE_DIALOG:
      if (payload < 0) return state;
      if (payload > state.dialog.maxValue)
        return {
          ...state,
          dialog: { ...state.dialog, value: state.dialog.maxValue }
        };
      return { ...state, dialog: { ...state.dialog, value: payload } };
    case actionTypes.STOP_VIDEO:
      return { ...state, isPlaying: false };
    case actionTypes.HANDLE_RADIO_SELECT:
      return {
        ...state,
        overlayMode: payload,
        sliderObj: sliderObjSelector[payload]
          ? sliderObjSelector[payload].slider
          : null,
        commitOnChange: sliderObjSelector[payload]
          ? sliderObjSelector[payload].commit
          : null
      };
    case actionTypes.HANDLE_CANVAS_CLICK:
      return { ...state, status: payload };
    case actionTypes.HANDLE_CHANGE_SLIDER:
    case actionTypes.HANDLE_COMMITTED_SLIDER:
      return { ...state, valueSlider: { ...state.valueSlider, ...payload } };
    case actionTypes.STOP_PROGRES:
      return { ...state, progressFull: null, progress: null };
    case actionTypes.START_PROGRESS:
      return {
        ...state,
        progressFull: payload,
        progress: 0
      };
    case actionTypes.SEND_MESSAGE:
      return { ...state, ...initialConverter, numProcess: payload };
    case actionTypes.ADD_PROGRESS:
      return { ...state, progress: state.progress + payload };
    case actionTypes.IMPORTING:
      return { ...state, importedFile: payload };
    case actionTypes.FINISH_LINEAR: {
      const { path } = payload;
      const { videoDatas } = state;
      const {
        progressFromWorker: { beginTime }
      } = videoDatas[path];
      const timePassed = new Date().getTime() - beginTime;
      return {
        ...state,
        videoDatas: {
          ...state.videoDatas,
          [path]: {
            ...state.videoDatas[path],
            completeWork: true,
            cancelWork: false,
            progressFromWorker: {
              ...state.videoDatas[path].progressFromWorker,
              timePassed: showTime(moment.duration(timePassed)),
              timeLeft: 'Job finished',
              timeAll: showTime(moment.duration(timePassed))
            }
          }
        }
      };
    }
    case actionTypes.CANCEL_LINEAR: {
      const { path } = payload;
      return {
        ...state,
        videoDatas: {
          ...state.videoDatas,
          [path]: {
            ...state.videoDatas[path],
            completeWork: false,
            cancelWork: true,
            progressFromWorker: {
              ...state.videoDatas[path].progressFromWorker,
              timeLeft: 'Job cancelled'
            }
          }
        }
      };
    }
    case actionTypes.BEGIN_LINEAR: {
      const { videoDatas, numProcess } = state;
      const { path, index, beginFrame, endFrame } = payload;
      let { progressFromWorker } = videoDatas[path];

      if (!progressFromWorker) {
        progressFromWorker = { bar: Array(numProcess).fill(null) };
      }

      const { bar } = progressFromWorker;

      const substituteBar = {
        progress: 0,
        delay: 100,
        percent: 0,
        beginFrame,
        endFrame
      };

      const newBar = bar.map((val, idx) => {
        if (idx === index) return substituteBar;
        return val;
      });

      let activeProcess = 0;

      const info = newBar.reduce(
        (prev, val) => {
          if (val === null) return prev;
          activeProcess++;
          return {
            progress: 0,
            beginFrame: Math.min(prev.beginFrame, val.beginFrame),
            endFrame: Math.max(prev.endFrame, val.endFrame)
          };
        },
        { progress: 0, beginFrame: 1e10, endFrame: -1 }
      );

      info.bar = newBar;

      info.percent = 0;
      info.FPS = 0;

      info.timePassed = showTime(moment.duration(0));
      info.timeLeft = 'determining...';
      info.timeAll = 'determining...';

      const readyToWork = activeProcess === numProcess;
      if (readyToWork) info.beginTime = new Date().getTime();

      return {
        ...state,
        videoDatas: {
          ...state.videoDatas,
          [path]: {
            ...state.videoDatas[path],
            readyToWork,
            completeWork: false,
            cancelWork: false,
            progressFromWorker: info
          }
        }
      };
    }
    case actionTypes.UPDATE_LINEAR: {
      const { videoDatas } = state;
      const { path, index, frame, ...other } = payload;
      const { readyToWork } = videoDatas[path];
      if (!readyToWork) return state;
      const {
        progressFromWorker: { bar, beginTime }
      } = videoDatas[path];

      const now = new Date().getTime();
      const timePassed = now - beginTime;

      const barX = bar[index];
      const substituteBar = {
        progress: frame - barX.beginFrame,
        delay:
          ((frame - barX.beginFrame - barX.progress) /
            (frame - barX.beginFrame)) *
          timePassed,
        percent:
          ((frame - barX.beginFrame) / (barX.endFrame - barX.beginFrame)) * 100,
        frame,
        ...other
      };

      if (substituteBar.percent > 100) {
        substituteBar.percent = 100;
      }

      const newBar = bar.map((val, idx) => {
        if (idx === index) return substituteBar;
        return val;
      });

      const info = newBar.reduce(
        (prev, val) => ({
          progress:
            prev.progress +
            Math.min(val.progress, val.endFrame - val.beginFrame),
          beginFrame: Math.min(prev.beginFrame, val.beginFrame),
          endFrame: Math.max(prev.endFrame, val.endFrame)
        }),
        { progress: 0, beginFrame: 1e10, endFrame: -1 }
      );

      info.bar = newBar;
      info.percent = (info.progress / (info.endFrame - info.beginFrame)) * 100;
      if (info.percent > 100) info.percent = 100;
      info.FPS = (info.progress / timePassed) * 1000;
      info.beginTime = beginTime;

      let timeLeft =
        ((info.endFrame - info.progress - info.beginFrame) / info.FPS) * 1000;
      if (timeLeft < 0) timeLeft = 0;

      info.timePassed = showTime(moment.duration(timePassed));
      if (timeLeft === 0) info.timeLeft = 'finalizing...';
      else info.timeLeft = showTime(moment.duration(timeLeft));
      info.timeAll = showTime(moment.duration(timeLeft + timePassed));

      return {
        ...state,
        videoDatas: {
          ...state.videoDatas,
          [path]: {
            ...state.videoDatas[path],
            progressFromWorker: info
          }
        }
      };
    }
    case actionTypes.HANDLE_NUM_PROCESS:
      return { ...state, displayNumProcess: Number(payload) };
    default:
      return state;
  }
}
