'use strict';

import { createSelector } from 'reselect';
import { initialState } from './reducers';

const make = (state, props) => (state ? state.TestField : {});

export const makeToolbarList = createSelector(
  make,
  state => (state ? state.toolbarList : initialState.toolbarList)
);
