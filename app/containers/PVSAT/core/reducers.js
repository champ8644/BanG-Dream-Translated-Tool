'use strict';

import { actionTypes } from './actions';

const PVSATActions = actionTypes;

export const initialState = {
  show: true,
  showButton: false,
  disabledButton: true,
  progress: 0,
  session: 0,
  text: '',
  answer: '',
  frame: 0,
  beginTs: NaN,
  currentStep: NaN,
  results: {},
  isPause: true,
  showStatus: false,
  feedback: ''
};
/*
PROP_TO_STATE,
  TEST_START,
  TEST_SHOW_0,
  TEST_ITERATE,
  TEST_SHOW,
  SET_ANSWER,
  TEST_FINISH,
  TEST_RESET;
*/
export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case PVSATActions.PROP_TO_STATE:
      return { ...state, ...payload };
    case PVSATActions.TOGGLE_SHOW_BUTTON:
      return { ...state, showButton: true };
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
        showStatus: true,
        feedback: payload.type,
        results: {
          ...state.results,
          [state.currentStep]: payload
        },
        disabledButton: true
      };
    case PVSATActions.FADE_OUT:
      return { ...state, show: false };
    case PVSATActions.TEST_START:
      return {
        ...state,
        showStatus: false,
        currentStep: 0,
        isPause: false,
        show: true,
        session: state.session + 1,
        ...payload
      };
    case PVSATActions.TEST_ITERATE:
      return {
        ...state,
        currentStep: state.currentStep + 1,
        show: true,
        disabledButton: false,
        ...payload
      };
    case PVSATActions.TEST_RESET:
      return { ...initialState, session: state.session };
    case PVSATActions.TEST_FINISH:
      return state;
    default:
      return state;
  }
}
