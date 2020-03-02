'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';
import path from 'path';

const make = (state, props) => (state ? state.Lounge : {});
const vCapSelector = state => state.Lounge.vCap;
const frameSelector = state => state.Lounge.frame;
const pathSelector = state => state.Lounge.videoFilePath;

export const makeCurrentFrame = createSelector(
  vCapSelector,
  frameSelector,
  (vCap, frame) => {
    if (!vCap) return { frame: null, ms: null, percent: null };
    vCap.setFrame(frame);
    return { frame, ms: vCap.ms(), percent: vCap.percent() };
  }
);

export const makeVideoFilePath = createSelector(
  pathSelector,
  filePath =>
    filePath
      ? {
          videoFilePath: filePath,
          videoFileName: path.basename(filePath)
        }
      : {
          videoFilePath: initialState.videoFilePath,
          videoFileName: ''
        }
);

export const makeVideoCapture = createSelector(
  vCapSelector,
  vCap => vCap || initialState.vCap
);

export const makeDialogData = createSelector(
  make,
  state => (state ? state.dialog : initialState.dialog)
);

export const makeStatusData = createSelector(
  make,
  state => (state ? state.status : initialState.status)
);

export const makeSlider = createSelector(
  make,
  state => (state ? state.valueSlider : initialState.valueSlider)
);

export const makeProgress = createSelector(
  make,
  state => (state ? state.progress : initialState.progress)
);

export const makeProgressBar = createSelector(
  make,
  state => (state ? state.progressFull : initialState.progressFull)
);

export const makeWillUpdateNextFrame = createSelector(
  make,
  state =>
    state ? state.willUpdateNextFrame : initialState.willUpdateNextFrame
);

export const makeOverlayMode = createSelector(
  make,
  state => (state ? state.overlayMode : initialState.overlayMode)
);

export const makeSliderObj = createSelector(
  make,
  state => (state ? state.sliderObj : initialState.sliderObj)
);

export const makePercentLinear = createSelector(
  make,
  state => (state ? state.percentLinear : initialState.percentLinear)
);
