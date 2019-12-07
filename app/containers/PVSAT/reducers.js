'use strict';

import { actionTypes } from './actions';

const PVSATActions = actionTypes;

export const initialState = {
  show: true,
  showButton: false,
  progress: 0,
  text: '',
  answer: '',
  frame: 0,
  beginTs: NaN,
  currentStep: NaN,
  results: {},
  isPause: true
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case PVSATActions.PROP_TO_STATE:
      return { ...state, ...payload };
    case PVSATActions.TIMER_PLAY:
      return {
        ...state,
        progress: 100,
        beginTs: new Date().getTime()
      };
    case PVSATActions.TIMER_RESET:
      return { ...state, frame: state.frame + 1, progress: 0 };
    case PVSATActions.SET_ANSWER:
      return {
        ...state,
        results: {
          ...state.results,
          [state.currentStep]: payload
        },
        showButton: false
      };
    case PVSATActions.FADE_OUT:
      return { ...state, show: false };
    case PVSATActions.TEST_START:
      return {
        ...state,
        currentStep: 0,
        isPause: false,
        show: true,
        ...payload
      };
    case PVSATActions.TEST_ITERATE:
      return {
        ...state,
        currentStep: state.currentStep + 1,
        show: true,
        showButton: true,
        ...payload
      };
    case PVSATActions.TEST_RESET:
      return initialState;
    case PVSATActions.TEST_FINISH:
      return state;
    default:
      return state;
  }
}
