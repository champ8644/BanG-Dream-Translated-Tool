'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.MainMenu : {});

export const bakeShowHN = text => {
  if (typeof text !== 'string') return '';
  const output = `${text.slice(0, -2)}/${text.slice(-2)}`;
  if (output === '/') return '';
  return output;
};

export const makeHN = createSelector(
  make,
  state => (state ? state.HN : initialState.HN)
);

export const makeDisplayHN = createSelector(
  make,
  state => (state ? bakeShowHN(state.displayHN) : initialState.displayHN)
);

export const makeLoading = createSelector(
  make,
  state => (state ? state.loading : initialState.loading)
);

export const makeData = createSelector(
  make,
  state => (state ? state.data : initialState.data)
);
