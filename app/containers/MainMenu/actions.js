'use strict';

import prefixer from '../../utils/reducerPrefixer';
import { timeOut } from '../../utils/asyncHelper';

const prefix = '@@MainMenu';
const actionTypesList = [
  'HANDLE_SUBMITHN',
  'HANDLE_CHANGEHN',
  'LOAD_FIRE_DATA',
  'FETCH_FIRE_DATA',
  'EMPTY_FIRE_DATA',
  'SAVE_TEST_RESULTS'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function _handleSubmitHN() {
  return {
    type: actionTypes.HANDLE_SUBMITHN
  };
}

export function handleSubmitHN() {
  return async (dispatch, getState) => {
    const state = getState().MainMenu;
    if (state.HN === state.displayHN) return;
    dispatch(loadFireData());
    if (state.displayHN !== '') {
      await timeOut(2000);
      dispatch(_fetchFireData(/* TODO:Firebase */));
      return;
    }
    dispatch(emptyFireData());
  };
}

export function handleChangeHN(payload) {
  return dispatch => {
    if (/^\d*\/?\d*$/.test(payload))
      return dispatch({
        type: actionTypes.HANDLE_CHANGEHN,
        payload: payload.replace(/\//g, '')
      });
  };
}

export function loadFireData() {
  return {
    type: actionTypes.LOAD_FIRE_DATA
  };
}

export function _fetchFireData(payload) {
  return {
    type: actionTypes.FETCH_FIRE_DATA,
    payload
  };
}

export function emptyFireData() {
  return {
    type: actionTypes.EMPTY_FIRE_DATA
  };
}

export function saveTestResults(payload) {
  return {
    type: actionTypes.SAVE_TEST_RESULTS,
    payload
  };
}
