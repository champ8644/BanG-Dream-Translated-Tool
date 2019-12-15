'use strict';

import prefixer from '../../../utils/reducerPrefixer';
import { time } from '../constants/constant';
import { timeOut } from '../../../utils/asyncHelper';

const prefix = '@@PVSAT';
const actionTypesList = [
  'PROP_TO_STATE',
  'TEST_START',
  'TEST_SHOW_0',
  'TEST_ITERATE',
  'TEST_SHOW',
  'SET_ANSWER',
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

async function forStepPermission(time, getState) {
  const prev = getState().PVSAT;
  await timeOut(time);
  const next = getState().PVSAT;
  if (prev.currentStep !== next.currentStep) return true;
  if (prev.session !== next.session) return true;
  return false;
}

export function testStart() {
  return dispatch => {
    dispatch({ type: actionTypes.TEST_START });
    dispatch(testShow0());
  };
}

function testShow0() {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.TEST_SHOW_0 });
    if (await forStepPermission(time.show, getState)) dispatch(testIterate());
  };
}

function testIterate() {
  return async (dispatch, getState) => {
    const { currentStep, length } = getState().PVSAT;
    const step = currentStep + 1;
    if (step === length) {
      dispatch(testFinish());
      return;
    }
    dispatch({ type: actionTypes.TEST_ITERATE });
    if (await forStepPermission(time.iterate, getState)) dispatch(testShow());
  };
}

function testShow() {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.TEST_SHOW });
    if (await forStepPermission(time.show, getState)) dispatch(answerTimeOut());
  };
}

function answerTimeOut() {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const reactionTime = state.interval;
    if (state.results[state.currentState] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          correct: false,
          type: 'time out',
          progress: (100 * reactionTime) / state.interval
        })
      );
  };
}

function setAnswer(payload) {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.SET_ANSWER,
      payload
    });
    if (await forStepPermission(time.popup, getState)) dispatch(testIterate());
  };
}

function testFinish() {
  return (dispatch, getState) => {
    const state = getState().PVSAT;
    dispatch({ type: actionTypes.TEST_FINISH });
    state.callBack(state.results);
  };
}

export function answerCorrect(response) {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const reactionTime = new Date().getTime() - state.beginTs;
    if (state.results[state.currentState] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          correct: true,
          type: 'correct',
          response,
          progress: (100 * reactionTime) / state.interval
        })
      );
  };
}

export function answerWrong(response) {
  return async (dispatch, getState) => {
    const state = getState().PVSAT;
    const reactionTime = new Date().getTime() - state.beginTs;
    if (state.results[state.currentState] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          correct: false,
          type: 'wrong',
          response,
          progress: (100 * reactionTime) / state.interval
        })
      );
  };
}

export function testReset() {
  return {
    type: actionTypes.TEST_RESET
  };
}
