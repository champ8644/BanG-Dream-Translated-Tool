'use strict';

import { actionTypes } from './actions';

const PVSATActions = actionTypes;

export const initialState = {
  show: false,
  showButton: false,
  disabledButton: true,
  progress: 0,
  session: 0,
  text: '',
  answer: '',
  beginTs: NaN,
  currentStep: 0,
  results: {},
  showStatus: false,
  showProgress: false,
  feedback: ''
};
/*
  PROP_TO_STATE
  TEST_START
  TEST_SHOW_0
  TEST_ITERATE
  TEST_SHOW
  SET_ANSWER
  TEST_FINISH
  TEST_RESET
*/

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case PVSATActions.TEST_START:
      return {
        ...state,
        showProgress: true,
        show: false,
        showButton: false,
        progress: 0,
        text: '',
        answer: '',
        currentStep: 0,
        results: {},
        showStatus: false,
        feedback: '',
        ...payload
      };
    case PVSATActions.TEST_SHOW_0: {
      const data = state.testData || {};
      const obj = data[0] || {};
      return {
        ...state,
        show: true,
        progress: 100,
        ...obj
      };
    }
    case PVSATActions.TEST_ITERATE: {
      const demoMode = {};
      if (state.mode === 'DEMO') {
        demoMode.interval = 0;
      }
      return {
        ...state,
        show: false,
        showButton: false,
        showStatus: false,
        currentStep: state.currentStep + 1,
        progress: 0,
        ...demoMode
      };
    }
    case PVSATActions.TEST_SHOW: {
      const data = state.testData || {};
      const obj = data[state.currentStep] || {};
      const demoMode = {};
      if (state.mode === 'DEMO') {
        demoMode.progress = 0;
      }
      return {
        ...state,
        show: true,
        showButton: true,
        disabledButton: false,
        progress: 100,
        ...obj,
        beginTs: new Date().getTime(),
        feedback: '',
        ...demoMode
      };
    }
    case PVSATActions.SET_ANSWER:
      return {
        ...state,
        disabledButton: true,
        showStatus: true,
        feedback: '',
        results: {
          ...state.results,
          [state.currentStep]: payload
        },
        ...payload
      };
    case PVSATActions.HIDE_MSG:
      return {
        ...state,
        showStatus: false
      };
    case PVSATActions.TEST_RESET:
      return { ...initialState, session: state.session + 1 };
    default:
      return state;
  }
}
