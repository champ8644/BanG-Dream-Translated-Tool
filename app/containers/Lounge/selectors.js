'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';
import path from 'path';

const make = (state, props) => (state ? state.Lounge : {});

export const makeVideoFilePath = createSelector(
  make,
  state => (state ? state.videoFilePath : initialState.videoFilePath)
);

export const makeVideoFileName = createSelector(
  make,
  state => {
    if (!state) return '';
    if (!state.videoFilePath) return '';
    return path.basename(state.videoFilePath);
  }
);
