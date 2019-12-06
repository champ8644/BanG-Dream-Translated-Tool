'use strict';

import { actionTypes } from './actions';

export const initialState = {
  show: true,
  showButton: false,
  progress: 0,
  text: '',
  answer: '',
  frame: 0,
  beginTs: NaN,
  currentStep: 0,
  results: {}
};

export default function Home(state = initialState, action) {
  // eslint-disable-next-line prefer-const, no-unused-vars
  let { type, payload } = action;
  switch (type) {
    case actionTypes.PROP_TO_STATE:
      return { ...state, ...payload };
    case actionTypes.SHOW_BUTTONS:
      return { ...state, showButton: true };
    case actionTypes.TIMER_PLAY:
      return { ...state, progress: 100, beginTs: new Date().getTime() };
    case actionTypes.TIMER_RESET:
      return { ...state, frame: state.frame + 1, progress: 0 };
    case actionTypes.SET_ANSWER:
      return {
        ...state,
        results: {
          ...state.results,
          [state.currentStep]: payload
        }
      };
    case actionTypes.ANSWER_CORRECT:
      return { ...state };
    case actionTypes.ANSWER_WRONG:
      return { ...state };
    case actionTypes.NUMBER_IN:
      return { ...state, show: true, ...payload };
    case actionTypes.NUMBER_OUT:
      return { ...state, show: false };
    case actionTypes.PROGRESS_STEP:
      return { ...state, currentStep: state.currentStep + 1 };
    default:
      return state;
  }
}
