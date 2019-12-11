'use strict';

import prefixer from '../../utils/reducerPrefixer';

const prefix = '@@MainMenu';
const actionTypesList = ['HANDLE_SUBMITHN', 'HANDLE_CHANGEHN'];

export const actionTypes = prefixer(prefix, actionTypesList);

export function handleSubmitHN() {
  return {
    type: actionTypes.HANDLE_SUBMITHN
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
