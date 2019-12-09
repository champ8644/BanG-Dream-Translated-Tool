'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.Stroop : {});

export const makeStroop = createSelector(
  make,
  state => (state ? state.Stroop : initialState.Stroop)
);
