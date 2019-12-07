'use strict';

import prefixer from '../../utils/reducerPrefixer';
import { timeOut } from '../../utils/asyncHelper';

const prefix = '@@PVSAT';
const actionTypesList = [
  'PROP_TO_STATE',
  'TIMER_PLAY',
  'TIMER_RESET',
  'SET_ANSWER',
  'FADE_OUT',
  'TEST_START',
  'TEST_ITERATE',
  'TEST_FINISH',
  'TEST_RESET'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function propToState(payload) {
  return {
    type: actionTypes.PROP_TO_STATE,
    payload
  };
}

function timerPlay() {
  return {
    type: actionTypes.TIMER_PLAY
  };
}

function timerReset() {
  return {
    type: actionTypes.TIMER_RESET
  };
}

function timerRestart() {
  return async dispatch => {
    dispatch(timerReset());
    await timeOut(1);
    dispatch(timerPlay());
  };
}

function setAnswer(payload) {
  return {
    type: actionTypes.SET_ANSWER,
    payload
  };
}

function answerTimeOut() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    let reactionTime = new Date().getTime() - state.beginTs;
    if (reactionTime > state.interval) reactionTime = state.interval;
    if (state.results[state.currentState] === undefined)
      dispatch(setAnswer({ reactionTime, correct: false, type: 'time out' }));
  };
}

export function answerCorrect() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const reactionTime = new Date().getTime() - state.beginTs;
    if (state.results[state.currentState] === undefined)
      dispatch(setAnswer({ reactionTime, correct: true, type: 'correct' }));
  };
}

export function answerWrong() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const reactionTime = new Date().getTime() - state.beginTs;
    if (state.results[state.currentState] === undefined)
      dispatch(setAnswer({ reactionTime, correct: false, type: 'wrong' }));
  };
}

function fadeOut() {
  return {
    type: actionTypes.FADE_OUT
  };
}

function animate(id) {
  return async (dispatch, getState) => {
    dispatch(timerRestart());
    const { iTime, eTime } = getState().PVSAT;
    await timeOut(iTime);
    if (getState().PVSAT.currentStep !== id) return false;
    dispatch(fadeOut());
    await timeOut(eTime);
    if (getState().PVSAT.currentStep !== id) return false;
    return true;
  };
}

function _testStart(payload) {
  return {
    type: actionTypes.TEST_START,
    payload
  };
}

export function testStart() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const { text, answer } = state.testData[0];
    dispatch(_testStart({ text, answer }));
    const notTerminated = await dispatch(animate(0));
    if (notTerminated) {
      dispatch(testIterate());
    }
  };
}

function _testIterate(payload) {
  return {
    type: actionTypes.TEST_ITERATE,
    payload
  };
}

function testIterate() {
  return async (dispatch, getState) => {
    const { currentStep, length, testData } = getState().PVSAT;
    if (currentStep + 1 === length) {
      dispatch(testFinish());
      return;
    }
    const { text, answer } = testData[currentStep + 1];
    dispatch(_testIterate({ text, answer }));
    const notTerminated = await dispatch(animate(currentStep + 1));
    if (notTerminated) {
      dispatch(answerTimeOut());
      dispatch(testIterate());
    }
  };
}

function _testFinish() {
  return {
    type: actionTypes.TEST_FINISH
  };
}

function testFinish() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    state.callBack(state.results);
    dispatch(_testFinish());
  };
}

export function testReset() {
  return {
    type: actionTypes.TEST_RESET
  };
}
