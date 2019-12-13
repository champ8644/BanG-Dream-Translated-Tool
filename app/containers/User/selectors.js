'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';
import queryString from 'query-string';

const make = (state, props) => (state ? state.User : {});

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

export const makeData = createSelector(
  make,
  state => (state ? state.data : initialState.data)
);

export const makeQuery = createSelector(
  props => (props ? props.location : {}),
  location => {
    const query = queryString.parse(location.search);
    return query.hn || '';
  }
);
