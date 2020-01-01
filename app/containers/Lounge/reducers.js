'use strict';

import { actionTypes } from './actions';

export const initialState = {
  videoFilePath: '',
  vCap: null,
  vCapPackage: {},
  canvasRef: null,
  isPlaying: false,
  frame: null,
  dialog: {
    open: false,
    type: null,
    value: 0,
    maxValue: null
  },
  status: {}
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case actionTypes.SELECT_NEW_VIDEO:
      return { ...state, ...payload, isPlaying: false };
    case actionTypes.SEND_CANVAS:
      return { ...state, canvasRef: payload };
    case actionTypes.START_VIDEO:
      return { ...state, isPlaying: true };
    case actionTypes.UPDATE_FRAME:
      return { ...state, ...payload };
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
    case actionTypes.HANDLE_CANVAS_CLICK:
      return { ...state, status: payload };
    default:
      return state;
  }
}
