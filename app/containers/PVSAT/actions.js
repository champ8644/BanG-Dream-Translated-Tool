'use strict';

import prefixer from '../../utils/reducerPrefixer';
import { timeOut } from '../../utils/asyncHelper';

const prefix = '@@PVSAT';
const actionTypesList = [
  'PROP_TO_STATE',
  'SHOW_BUTTONS',
  'TIMER_PLAY',
  'TIMER_RESET',
  'SET_ANSWER',
  'ANSWER_CORRECT',
  'ANSWER_WRONG',
  'NUMBER_IN',
  'NUMBER_OUT',
  'TEST_FINISH',
  'PROGRESS_STEP'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function propToState(payload) {
  return {
    type: actionTypes.PROP_TO_STATE,
    payload
  };
}

export function showButtons() {
  return {
    type: actionTypes.SHOW_BUTTONS
  };
}

export function timerPlay() {
  return {
    type: actionTypes.TIMER_PLAY
  };
}

export function timerReset() {
  return {
    type: actionTypes.TIMER_RESET
  };
}

export function timerRestart() {
  return async dispatch => {
    dispatch(timerReset());
    await timeOut(1);
    dispatch(timerPlay());
  };
}

export function setAnswer(payload) {
  return {
    type: actionTypes.SET_ANSWER,
    payload
  };
}

export function answerTimeOut() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    let reactionTime = new Date().getTime() - state.beginTs;
    if (reactionTime > state.interval) reactionTime = state.interval;
    dispatch(setAnswer({ reactionTime, correct: false, type: 'time out' }));
    dispatch(progressStep());
    dispatch(testIterate());
  };
}

export function answerCorrect() {
  return {
    type: actionTypes.ANSWER_CORRECT
  };
}

export function answerWrong() {
  return {
    type: actionTypes.ANSWER_WRONG
  };
}

export function numberIn(payload) {
  return {
    type: actionTypes.NUMBER_IN,
    payload
  };
}

export function numberOut() {
  return {
    type: actionTypes.NUMBER_OUT
  };
}

export function testStart() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const { text, answer } = state.testData[0];
    dispatch(numberIn({ text, answer }));
    dispatch(timerRestart());
    await timeOut(state.iTime);
    dispatch(numberOut());
    await timeOut(state.eTime);
    dispatch(progressStep());
    dispatch(showButtons());
    dispatch(testIterate());
  };
}

export function testIterate() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const { currentStep } = state;
    if (currentStep === state.length) {
      dispatch(testFinish());
      return;
    }
    const { text, answer } = state.testData[state.currentStep];
    dispatch(numberIn({ text, answer }));
    dispatch(timerRestart());
    await timeOut(state.iTime);
    if (state.currentStep !== currentStep) return;
    dispatch(numberOut());
    await timeOut(state.eTime);
    if (state.currentStep !== currentStep) return;
    dispatch(answerTimeOut());
  };
}

export function testFinish() {
  return {
    type: actionTypes.TEST_FINISH
  };
}

export function progressStep() {
  return {
    type: actionTypes.PROGRESS_STEP
  };
}
