'use strict';

import { actionTypes } from './actions';

export const initialState = {
  HN: '',
  data: null
};

export default function MainMenu(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case actionTypes.HANDLE_SUBMITHN:
      return state;
    case actionTypes.HANDLE_CHANGEHN:
      return { ...state, HN: payload };
    case actionTypes.FETCH_FIRE_DATA:
      return { ...state, data: payload };
    case actionTypes.RESET_FIRE_DATA:
      return { ...state, data: null };
    default:
      return state;
  }
}
