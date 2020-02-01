'use strict';

import { actionTypes } from './actions';

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
  valueSlider: { red: [20, 40], green: [30, 50], blue: [40, 60] },
  progress: null,
  progressFull: null,
  importedFile: null,
  willUpdateNextFrame: false,
  overlayMode: 'none'
};

export default function Lounge(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
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
      return { ...state, overlayMode: payload };
    case actionTypes.HANDLE_CANVAS_CLICK:
      return { ...state, status: payload };
    case actionTypes.HANDLE_CHANGE_SLIDER:
      return { ...state, valueSlider: { ...state.valueSlider, ...payload } };
    case actionTypes.STOP_PROGRES:
      return { ...state, progressFull: null, progress: null };
    case actionTypes.START_PROGRESS:
      return { ...state, progressFull: payload, progress: 0 };
    case actionTypes.ADD_PROGRESS:
      return { ...state, progress: state.progress + payload };
    case actionTypes.IMPORTING:
      return { ...state, importedFile: payload };
    default:
      return state;
  }
}
