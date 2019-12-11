'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.MainMenu : {});

export const makeHN = createSelector(
  make,
  state => {
    if (state) {
      const output = `${state.HN.slice(0, -2)}/${state.HN.slice(-2)}`;
      if (output === '/') return '';
      return output;
    }
    return initialState.HN;
  }
);
