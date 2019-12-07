'use strict';

import { actionTypes } from './actions';

const stroopActions = actionTypes;

const initialDisplay = {
  color: '#000',
  backgroundColor: '#000',
  text: '',
  showStatus: '',
  showX: false,
  showText: false
};

export const initialState = {
  progress: 0,
  answer: '',
  currentStep: 0,
  results: {},
  frame: 0,
  session: 0,
  initialDisplay,
  ...initialDisplay
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case stroopActions.TEST_START:
      return {
        ...state,
        currentStep: -1,
        isPause: false,
        ...payload
      };
    case stroopActions.TEST_PRE_X:
      return {
        ...state,
        ...state.initialDisplay,
        currentStep: state.currentStep + 1,
        frame: state.frame + 1,
        progress: 0,
        beginTs: NaN
      };
    case stroopActions.TEST_X:
      return { ...state, showX: true };
    case stroopActions.TEST_POST_X:
      return { ...state, ...state.initialDisplay };
    case stroopActions.TEST_INTERVAL:
      return {
        ...state,
        showText: true,
        progress: 100,
        beginTs: new Date().getTime()
      };
    case stroopActions.SET_ANSWER:
      return {
        ...state,
        showStatus: payload.type,
        showText: false,
        results: {
          ...state.results,
          [state.currentStep]: payload
        },
        progress: payload.progress
      };
    case stroopActions.TEST_RESET:
      return { ...initialState, session: state.session + 1 };
    default:
      return state;
  }
}
