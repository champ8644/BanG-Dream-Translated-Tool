'use strict';

import { actionTypes } from './actions';

export const initialState = {
  videoFilePath: '',
  vCap: null,
  vCapPackage: {}
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case actionTypes.SELECT_NEW_VIDEO:
      return { ...state, ...payload };
    case actionTypes.SEND_CANVAS:
      return {
        ...state,
        canvasRef: payload,
        ctx: () => payload.current.getContext('2d')
      };
    default:
      return state;
  }
}
