'use strict';

/* eslint-disable no-console */

import { endFrameTest, startFrameTest } from './constants/config';
import { exporting, importing } from './loungeFunctions/lounge';
import { gapConst, videoListMaxHeight, videoListMaxWidth } from './constants';
import mainEvent, { devalidLoop } from './mainFunctions/mainEvent';

import VideoCapture from './VideoCapture';
import cv from 'opencv4nodejs';
import { message2Worker } from './utils';
import prefixer from '../../utils/reducerPrefixer';
import { remote } from 'electron';
import testerFunction from './nodeFunctions';
import { throwAlert } from '../Alerts/actions';

const { dialog } = remote;

const prefix = '@@Lounge';
const actionTypesList = [
  'SEND_MESSAGE',
  'SELECT_NEW_VIDEO',
  'UPDATE_FRAME',
  'SEND_CANVAS',
  'START_VIDEO',
  'STOP_VIDEO',
  'HANDLE_INPUT_FRAME',
  'UPDATE_FRAME',
  'HANDLE_CHANGE_DIALOG',
  'HANDLE_CANCEL_DIALOG',
  'HANDLE_CONFIRM_DIALOG',
  'HANDLE_OPEN_DIALOG',
  'HANDLE_CANVAS_CLICK',
  'HANDLE_CHANGE_SLIDER',
  'STOP_PROGRESS',
  'START_PROGRESS',
  'ADD_PROGRESS',
  'IMPORTING',
  'HANDLE_RADIO_SELECT',
  'HANDLE_COMMITTED_SLIDER',
  'UPDATE_LINEAR',
  'BEGIN_LINEAR',
  'FINISH_LINEAR',
  'CANCEL_LINEAR',
  'HANDLE_NUM_PROCESS',
  'ADD_QUEUE',
  'TICK_QUEUE',
  'ACTIVATING_QUEUE',
  'INACTIVATING_QUEUE',
  'ON_CLOSE_VCAP_LIST',
  'ON_CANCEL_VCAP_LIST',
  'ON_REFRESH_VCAP_LIST',
  'CANCEL_CLOSE_CONVERTING_DIALOG',
  'CONFIRMING_CLOSE_CONVERTING_DIALOG',
  'CONFIRMED_CLOSE_CONVERTING_DIALOG',
  'ON_SWITCH_FPS_VCAP_LIST',
  'FINISHING_QUEUE'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function testingFunc() {
  return (dispatch, getState) => {
    testerFunction();
  };
}

export function devQueue(payload = {}) {
  return (dispatch, getState) => {
    const { videoFilePath, vCap, displayNumProcess } = getState().Lounge;
    const { start: _start, end: _end, test } = payload;
    let start = _start;
    let end = _end;
    if (start === undefined) start = 0;
    if (end === undefined) end = vCap.length;
    if (test) {
      start = startFrameTest;
      end = endFrameTest;
    }
    dispatch({
      type: actionTypes.TICK_QUEUE,
      payload: { displayNumProcess, path: vCap.path }
    });
    message2Worker('start-events', {
      videoFilePath,
      start,
      end,
      process: displayNumProcess
    });
  };
}

export function updateLinear(payload) {
  return {
    type: actionTypes.UPDATE_LINEAR,
    payload
  };
}

export function updateThumbnail(payload) {
  return (dispatch, getState) => {
    const { path, info } = payload;
    const { vCap } = getState().Lounge.videoDatas[path];
    if (vCap) vCap.updateThumbnail(info);
    console.log('info: ', info);
  };
}

export function beginLinear(payload) {
  return {
    type: actionTypes.BEGIN_LINEAR,
    payload
  };
}

export function cancelLinear(payload) {
  return (dispatch, getState) => {
    const {
      closeConvertingDialog: { path }
    } = getState().Lounge;
    dispatch({
      type: actionTypes.CANCEL_LINEAR,
      payload
    });
    if (path)
      dispatch({
        type: actionTypes.ON_CLOSE_VCAP_LIST,
        payload: path
      });
    dispatch(tickQueue());
  };
}

export function finishLinear(payload) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FINISH_LINEAR,
      payload
    });
    dispatch(tickQueue());
  };
}

export function handleCancelCloseConvertingDialog() {
  return {
    type: actionTypes.CANCEL_CLOSE_CONVERTING_DIALOG
  };
}

export function handleConfirmCloseConvertingDialog() {
  return dispatch => {
    dispatch({
      type: actionTypes.CONFIRMED_CLOSE_CONVERTING_DIALOG
    });
    dispatch(stopQueue());
  };
}

export function onCloseVCapList(path) {
  return (dispatch, getState) => {
    const { videoDatas } = getState().Lounge;
    const { readyToWork, cancelWork, completeWork } = videoDatas[path];
    if (readyToWork && !cancelWork && !completeWork)
      dispatch({
        type: actionTypes.CONFIRMING_CLOSE_CONVERTING_DIALOG,
        payload: path
      });
    else
      dispatch({
        type: actionTypes.ON_CLOSE_VCAP_LIST,
        payload: path
      });
  };
}

export function onCancelVCapList() {
  return dispatch => {
    dispatch({ type: actionTypes.ON_CANCEL_VCAP_LIST });
    devalidLoop();
    message2Worker('stop-events');
  };
}

export function onRefreshVCapList(path) {
  return {
    type: actionTypes.ON_REFRESH_VCAP_LIST,
    payload: path
  };
}

export function onSwitchFPSVCapList(path) {
  return {
    type: actionTypes.ON_SWITCH_FPS_VCAP_LIST,
    payload: path
  };
}

export function sendCanvas(canvasRef) {
  return {
    type: actionTypes.SEND_CANVAS,
    payload: canvasRef
  };
}

export function handleNumProcess(e, value) {
  return {
    type: actionTypes.HANDLE_NUM_PROCESS,
    payload: value.key
  };
}

export function tickQueue() {
  return async (dispatch, getState) => {
    const {
      queue,
      videoDatas,
      displayNumProcess,
      isActivate
    } = getState().Lounge;
    if (!isActivate) return;
    let nextQueue = null;
    let vCapLength;
    for (let i = 0; i < queue.length; i++) {
      const path = queue[i];
      const { vCap, completeWork, cancelWork, readyToWork } = videoDatas[path];
      if (!completeWork && !cancelWork && !readyToWork) {
        nextQueue = path;
        vCapLength = vCap.length;
        break;
      }
    }
    if (!nextQueue) return dispatch({ type: actionTypes.FINISHING_QUEUE });
    dispatch({
      type: actionTypes.TICK_QUEUE,
      payload: { displayNumProcess, path: nextQueue }
    });
    message2Worker('start-events', {
      videoFilePath: nextQueue,
      start: 0,
      end: vCapLength,
      process: displayNumProcess
    });
  };
}

export function startQueue() {
  return dispatch => {
    dispatch({ type: actionTypes.ACTIVATING_QUEUE });
    dispatch(tickQueue());
  };
}

export function stopQueue() {
  return dispatch => {
    dispatch({ type: actionTypes.INACTIVATING_QUEUE });
    devalidLoop();
    message2Worker('stop-events');
  };
}

export function addQueue() {
  return async (dispatch, getState) => {
    const { queue, videoDatas } = getState().Lounge;
    const { filePaths, canceled } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Video files',
          extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
        }
      ]
    });
    if (canceled) return;
    try {
      const dupFile = [];
      const uniqueFilePaths = filePaths.filter(filepath => {
        let isUnique = true;
        queue.forEach(path => {
          if (path === filepath) isUnique = false;
        });
        if (!isUnique) dupFile.push(filepath);
        return isUnique;
      });
      if (uniqueFilePaths.length !== filePaths.length)
        dispatch(throwAlert({ message: 'There is duplicate file(s)' }));
      dispatch({
        type: actionTypes.ADD_QUEUE,
        payload: {
          unique: uniqueFilePaths
            .map(path => {
              let vCap = null;
              try {
                vCap = new VideoCapture({
                  path,
                  maxWidth: videoListMaxWidth,
                  maxHeight: videoListMaxHeight
                });
              } catch (err) {
                dispatch(throwAlert({ message: err }));
                vCap = null;
              }
              return vCap;
            })
            .filter(item => item),
          dup: dupFile.map(path => videoDatas[path].vCap)
        }
      });
    } catch (err) {
      if (typeof err === 'object' && err !== null)
        dispatch(throwAlert({ message: err.message }));
      else dispatch(throwAlert({ message: err }));
    }
  };
}

export function openFile(fileName) {
  return async (dispatch, getState) => {
    const { canvasRef, valueSlider, overlayMode } = getState().Lounge;
    let filePaths;
    let canceled;
    if (!fileName) {
      ({ filePaths, canceled } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: 'Video files',
            extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
          }
        ]
      }));
      if (canceled) return;
    } else filePaths = [fileName];
    try {
      const vCap = new VideoCapture({
        path: filePaths[0],
        canvas: canvasRef,
        updateFrame: async () => dispatch(updateFrame()),
        colorSlider: valueSlider,
        modePostProcessor: overlayMode
      });
      dispatch({
        type: actionTypes.SELECT_NEW_VIDEO,
        payload: {
          videoFilePath: filePaths[0],
          vCap
        }
      });
    } catch (err) {
      dispatch(throwAlert({ message: err }));
    }
  };
}

export function updateFrame() {
  return {
    type: actionTypes.UPDATE_FRAME
  };
}

export function startVideo() {
  return async (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.play();
  };
}

export function stopVideo() {
  return async (dispatch, getState) => {
    const { vCap, progressFull } = getState().Lounge;
    devalidLoop();
    message2Worker('stop-events');
    if (progressFull) stopProgress();
    vCap.stop();
  };
}

export function handleInputFrame(e) {
  const { value } = Number(e.target);
  return {
    type: actionTypes.HANDLE_INPUT_FRAME,
    payload: value
  };
}

export function previousFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(-1);
    dispatch(updateFrame());
  };
}

export function nextFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(1);
    dispatch(updateFrame());
  };
}

export function rewindFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(-1000, 'ms');
    dispatch(updateFrame());
  };
}

export function skipFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(1000, 'ms');
    dispatch(updateFrame());
  };
}

export function handleOpenDialog(type, value) {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    const dialog = { open: true, type, value: value.replace(',', '') };
    switch (type) {
      case 'frame':
        dialog.maxValue = vCap.length;
        break;
      case 'ms':
        dialog.maxValue = (vCap.length * 1000) / vCap.FPS;
        break;
      case 'percent':
        dialog.maxValue = 100;
        break;
      default:
        dialog.open = false;
        dialog.type = '';
        dialog.value = null;
        dialog.maxValue = null;
    }
    dispatch({
      type: actionTypes.HANDLE_OPEN_DIALOG,
      payload: dialog
    });
  };
}

export function handleChangeDialog(e) {
  return (dispatch, getState) => {
    const {
      dialog: { type }
    } = getState().Lounge;
    let { value } = e.target;
    if (value === '') value = 0;
    switch (type) {
      case 'frame':
        value = parseInt(value, 10);
        if (isNaN(value)) return;
        break;
      case 'ms':
      case 'percent':
        value = parseFloat(value);
        if (isNaN(value)) return;
        break;
      default:
    }
    dispatch({
      type: actionTypes.HANDLE_CHANGE_DIALOG,
      payload: value
    });
  };
}

export function handleCancelDialog() {
  return {
    type: actionTypes.HANDLE_CANCEL_DIALOG
  };
}

export function handleConfirmDialog() {
  return (dispatch, getState) => {
    const { dialog, vCap } = getState().Lounge;
    dispatch({ type: actionTypes.HANDLE_CONFIRM_DIALOG });
    vCap.show(dialog.value, dialog.type);
    dispatch(updateFrame());
  };
}

export function handleKeyDownDialog(e) {
  return dispatch => {
    if (e.key === 'Enter') {
      dispatch(handleConfirmDialog());
    }
  };
}

export function handleRadioSelect(e) {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.setPostProcessor(e.target.value);
    vCap.show();
    dispatch({
      type: actionTypes.HANDLE_RADIO_SELECT,
      payload: e.target.value
    });
  };
}

function makeGap(x) {
  let a = x - gapConst;
  let b = x + gapConst;
  if (a < 0) a = 0;
  if (b > 255) b = 255;
  return [a, b];
}

export function handleCanvasClick(_event) {
  return (dispatch, getState) => {
    const { canvasRef, vCap, overlayMode } = getState().Lounge;
    let event = {};
    const {
      left: offsetLeft,
      top: offsetTop
    } = canvasRef.current.getBoundingClientRect();
    if (_event) event = _event;
    else
      event = {
        clientX: offsetLeft,
        clientY: offsetTop
      };
    let { clientX, clientY } = event;
    clientX -= offsetLeft;
    clientY -= offsetTop;
    clientX /= vCap.ratio;
    clientY /= vCap.ratio;
    const [b, g, r] = vCap.locatedClicked(clientX, clientY);
    let newValueSlider = null;
    switch (overlayMode) {
      case 'BGRFinder':
        if (!newValueSlider) {
          newValueSlider = {
            blue: makeGap(b),
            green: makeGap(g),
            red: makeGap(r)
          };
        }
      // eslint-disable-next-line no-fallthrough
      case 'HSVFinder':
        if (!newValueSlider) {
          const [h, s, v] = new cv.Mat(1, 1, cv.CV_8UC3, [b, g, r])
            .cvtColor(cv.COLOR_BGR2HSV)
            .atRaw(0, 0);
          newValueSlider = {
            hue: makeGap(h),
            sat: makeGap(s),
            val: makeGap(v)
          };
        }
        vCap.changeColorSlider(newValueSlider);
        dispatch({
          type: actionTypes.HANDLE_COMMITTED_SLIDER,
          payload: newValueSlider
        });
        break;
      default:
    }
    dispatch({
      type: actionTypes.HANDLE_CANVAS_CLICK,
      payload: {
        clientX,
        clientY,
        show: true,
        color: { hex: fullColorHex(r, g, b), r, b, g }
      }
    });
  };
}

export function mainEventBtn() {
  return async (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    mainEvent(vCap, -1);
  };
}

function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = `0${hex}`;
  }
  return hex;
}

function fullColorHex(r, g, b) {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);
  return `#${red}${green}${blue}`;
}

export function handleChangeSlider(name, value) {
  return {
    type: actionTypes.HANDLE_CHANGE_SLIDER,
    payload: { [name]: value }
  };
}

export function handleCommittedSlider() {
  return (dispatch, getState) => {
    const { vCap, valueSlider } = getState().Lounge;
    vCap.changeColorSlider(valueSlider);
    return {
      type: actionTypes.HANDLE_COMMITTED_SLIDER,
      payload: vCap.colorSlider
    };
  };
}

export function exportingLounge() {
  return exporting();
}

export function importingLounge() {
  return importing();
}

// export function handleInputChange(e) {
//   return dispatch => {
//     if (e.target.value === '') return changeSlider(0);
//     let num = parseFloat(e.target.value);
//     if (isNaN(num)) return;
//     if (num < 0) num = 0;
//     else if (num > 100) num = 100;
//     return dispatch(changeSlider(num));
//   };
// }

function stopProgress() {
  return {
    type: actionTypes.STOP_PROGRESS
  };
}
