'use strict';

import { actionTypes } from './actions';

export const initialState = {
  HN: '',
  displayHN: '',
  loading: false,
  data: {
    Stroop: {
      bg: { PreTest: {}, PostTest: {} },
      text: { PreTest: {}, PostTest: {} },
      color: { PreTest: {}, PostTest: {} }
    },
    PVSAT: { test: { PreTest: {}, PostTest: {} } }
  }
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
    case actionTypes.SAVE_TEST_RESULTS: {
      return {
        ...state,
        data: {
          ...state.data,
          [payload.type]: {
            ...state.data[payload.type],
            [payload.subtype]: {
              ...state.data[payload.type][payload.subtype],
              [payload.mode]: payload.results
            }
          }
        }
      };
    }
    default:
      return state;
  }
}
