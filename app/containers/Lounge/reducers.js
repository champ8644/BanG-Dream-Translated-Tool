'use strict';

import { actionTypes } from './actions';

export const initialState = {
  videoFilePath: ''
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case actionTypes.SELECT_NEW_VIDEO:
      return { ...state, ...payload };
    default:
      return state;
  }
}
