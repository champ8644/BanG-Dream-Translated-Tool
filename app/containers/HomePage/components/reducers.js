'use strict';

const settings = {
  enabled: true,
  label: 'Settings',
  imgSrc: 'Toolbar/settings.svg',
  invert: false
};

const back = {
  enabled: true,
  label: 'Back',
  imgSrc: 'Toolbar/chevron_left.svg',
  invert: false
};

const home = {
  enabled: true,
  label: 'Home',
  imgSrc: 'Toolbar/home.svg',
  invert: false
};

export const initialState = {
  toolbarList: {
    settings,
    back,
    home
  }
};

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export default function Toolbar(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case LOCATION_CHANGE:
      switch (payload.pathname) {
        case '/home/':
          return { ...state, toolbarList: { settings } };
        case '/home/pvsat':
          return { ...state, toolbarList: { back } };
        default:
          return initialState;
      }
    default:
      return state;
  }
}
