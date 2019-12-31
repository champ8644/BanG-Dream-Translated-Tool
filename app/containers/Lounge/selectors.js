'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';
import path from 'path';

const make = (state, props) => (state ? state.Lounge : {});

export const makeVideoFilePath = createSelector(
  make,
  state => {
    if (!state) return initialState;
    if (!state.videoFilePath) return '';
    return {
      videoFilePath: state.videoFilePath,
      videoFileName: path.basename(state.videoFilePath)
    };
  }
);

export const makeVideoCapture = createSelector(
  make,
  state => {
    if (!state) return '';
    if (!state.videoCapture) return '';
    const { vCap, width, height, FPS, length, ratio, dWidth, dHeight } = state;
    return { vCap, width, height, FPS, length, ratio, dWidth, dHeight };
  }
);
