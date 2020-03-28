'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.Toolbar : {});

export const makeToolbarList = createSelector(
  make,
  state => (state ? state.toolbarList : initialState.toolbarList)
);

export const makeToolbarTitle = createSelector(
  make,
  state => (state ? state.toolbarTitle : initialState.toolbarTitle)
);
