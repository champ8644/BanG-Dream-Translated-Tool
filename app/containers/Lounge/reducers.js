'use strict';

import { actionTypes } from './actions';
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
  percentLinear: null,
  overlayMode: 'none'
};

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
      return { ...state, progressFull: payload, progress: 0 };
    case actionTypes.ADD_PROGRESS:
      return { ...state, progress: state.progress + payload };
    case actionTypes.IMPORTING:
      return { ...state, importedFile: payload };
    case actionTypes.UPDATE_LINEAR:
      return { ...state, percentLinear: payload };
    default:
      return state;
  }
}
