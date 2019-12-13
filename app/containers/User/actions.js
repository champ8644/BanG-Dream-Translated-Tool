'use strict';

import prefixer from '../../utils/reducerPrefixer';
import { timeOut } from '../../utils/asyncHelper';

const prefix = '@@User';
const actionTypesList = ['FETCH_FIRE_DATA', 'RESET_FIRE_DATA'];

export const actionTypes = prefixer(prefix, actionTypesList);

export function resetFireData() {
  return {
    type: actionTypes.RESET_FIRE_DATA
  };
}

export function _fetchFireData(payload) {
  return {
    type: actionTypes.FETCH_FIRE_DATA,
    payload
  };
}

export function fetchFireData(payload) {
  return async (dispatch, state) => {
    dispatch(resetFireData());
    await timeOut(2000);
    dispatch(_fetchFireData(payload));
  };
}
