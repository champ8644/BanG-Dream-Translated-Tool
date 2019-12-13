'use strict';

import { actionTypes } from './actions';

export const initialState = {
  HN: '',
  displayHN: '',
  data: null,
  loading: false
};

export default function MainMenu(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.HANDLE_CHANGEHN:
      return { ...state, displayHN: payload };
    case actionTypes.LOAD_FIRE_DATA:
      return { ...state, HN: state.displayHN, loading: true, data: null };
    case actionTypes.FETCH_FIRE_DATA:
      return { ...state, loading: false, data: payload };
    case actionTypes.EMPTY_FIRE_DATA:
      return { ...state, loading: false, data: null };
    default:
      return state;
  }
}
