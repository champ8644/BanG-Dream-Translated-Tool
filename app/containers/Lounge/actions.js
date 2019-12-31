'use strict';

import prefixer from '../../utils/reducerPrefixer';

const prefix = '@@Lounge';
const actionTypesList = ['SELECT_NEW_VIDEO'];

export const actionTypes = prefixer(prefix, actionTypesList);

export function selectNewVideo(payload) {
  return {
    type: actionTypes.SELECT_NEW_VIDEO,
    payload
  };
}
