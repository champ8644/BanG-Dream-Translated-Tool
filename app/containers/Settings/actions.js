'use strict';

import { log } from '@Log';
import prefixer from '../../utils/reducerPrefixer';
import omitLodash from 'lodash/omit';
import { settingsStorage } from '../../utils/storageHelper';

const prefix = '@@Settings';
const actionTypesList = [
  'TOGGLE_SETTINGS',
  'FRESH_INSTALL',
  'ENABLE_AUTO_UPDATE_CHECK',
  'ENABLE_ANALYTICS',
  'COPY_JSON_FILE_TO_SETTINGS'
];

const excludeItemsFromSettingsFile = ['toggleSettings'];

export const actionTypes = prefixer(prefix, actionTypesList);

export function toggleSettings(data) {
  return {
    type: actionTypes.TOGGLE_SETTINGS,
    payload: data
  };
}

export function freshInstall({ ...data }, getState) {
  const { isFreshInstall } = data;

  return dispatch => {
    dispatch({
      type: actionTypes.FRESH_INSTALL,
      payload: isFreshInstall
    });
    dispatch(copySettingsToJsonFile(getState));
  };
}

export function enableAutoUpdateCheck({ ...data }, getState) {
  const { toggle } = data;

  return dispatch => {
    dispatch({
      type: actionTypes.ENABLE_AUTO_UPDATE_CHECK,
      payload: toggle
    });
    dispatch(copySettingsToJsonFile(getState));
  };
}

export function enableAnalytics({ ...data }, getState) {
  const { toggle } = data;

  return dispatch => {
    dispatch({
      type: actionTypes.ENABLE_ANALYTICS,
      payload: toggle
    });
    dispatch(copySettingsToJsonFile(getState));
  };
}

export function copySettingsToJsonFile(getState) {
  return dispatch => {
    const settingsState = getState().Settings ? getState().Settings : {};
    const filteredSettings = omitLodash(
      settingsState,
      excludeItemsFromSettingsFile
    );
    settingsStorage.setAll({ ...filteredSettings });
  };
}

export function copyJsonFileToSettings({ ...data }) {
  return {
    type: actionTypes.COPY_JSON_FILE_TO_SETTINGS,
    payload: {
      ...data
    }
  };
}
