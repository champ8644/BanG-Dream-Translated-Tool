'use strict';

// const settings = {
//   enabled: true,
//   label: 'Settings',
//   imgSrc: 'Toolbar/settings.svg',
//   invert: false
// };

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
  toolbarList: {},
  toolbarTitle: ''
};

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

export default function Toolbar(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case LOCATION_CHANGE: {
      if (payload.pathname === '/home')
        return { ...state, toolbarList: {}, toolbarTitle: '' };
      let toolbarList = { back };
      if (payload.pathname === '/home/mainmenu') toolbarList = { home };
      const res = /^\/home\/(.*)/.exec(payload.pathname);
      let toolbarTitle = '';
      if (res) {
        const ress = res[1].split('/');
        switch (ress[0]) {
          case 'mainmenu':
            toolbarTitle += 'BanG Dream! Translator Tool (DEMO) [alpha 1.0.0]';
            break;
          case 'pvsat':
            toolbarTitle += 'PVSAT';
            break;
          case 'stroop':
            toolbarTitle += 'Stroop';
            break;
          default:
        }
        if (ress[1]) {
          switch (ress[1][0]) {
            case 'D':
              toolbarTitle += ': DEMO';
              break;
            case 'A':
              toolbarTitle += ': Pre-test';
              break;
            case 'B':
              toolbarTitle += ': Post-test';
              break;
            default:
          }
          switch (ress[1][1]) {
            case '1':
              toolbarTitle += ' - Background';
              break;
            case '2':
              toolbarTitle += ' - Text';
              break;
            case '3':
              toolbarTitle += ' - Color';
              break;
            default:
          }
        }
        return { ...state, toolbarList, toolbarTitle };
      }
      return initialState;
    }
    default:
      return state;
  }
}
