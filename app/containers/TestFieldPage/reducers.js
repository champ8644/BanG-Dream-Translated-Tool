'use strict';

export const initialState = {
  toolbarList: {
    settings: {
      enabled: true,
      label: 'Back',
      imgSrc: 'Toolbar/chevron_left.svg',
      invert: false
    }
  }
};

export default function TestField(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}
