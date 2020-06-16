'use strict';

import { APP_NAME, APP_VERSION } from '../constants/meta';

import firebase from 'firebase';

export const analytics = firebase.analytics();

export const logEvent = (event, payload) =>
  analytics.logEvent(event, {
    appName: APP_NAME,
    appVersion: APP_VERSION,
    contents: payload
  });
