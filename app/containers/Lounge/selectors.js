'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';
import path from 'path';

const make = (state, props) => (state ? state.Lounge : {});

export const makeVideoFilePath = createSelector(
  make,
  state => {
    if (state) {
      if (state.videoFilePath) {
        return {
          videoFilePath: state.videoFilePath,
          videoFileName: path.basename(state.videoFilePath)
        };
      }
    }
    return {
      videoFilePath: initialState.videoFilePath,
      videoFileName: ''
    };
  }
);

export const makeVideoCapture = createSelector(
  make,
  state =>
    state
      ? { vCap: state.vCap, ...state.vCapPackage }
      : { vCap: initialState.vCap }
);

export const makeFrameData = createSelector(
  make,
  state =>
    state
      ? {
          frame: state.frame,
          ms: state.ms,
          percent: state.percent
        }
      : {
          frame: initialState.frame,
          ms: initialState.ms,
          percent: initialState.percent
        }
);

export const makeDialogData = createSelector(
  make,
  state => (state ? state.dialog : initialState.dialog)
);
