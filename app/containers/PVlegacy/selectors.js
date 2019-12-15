'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.PVSAT : {});

export const makePVSAT = createSelector(
  make,
  state => (state ? state.PVSAT : initialState.PVSAT)
);
