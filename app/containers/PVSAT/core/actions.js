'use strict';

import prefixer from '../../../utils/reducerPrefixer';
import { time } from '../constants/constant';
import { timeOut } from '../../../utils/asyncHelper';

const prefix = '@@PVSAT';
const actionTypesList = [
  'TEST_START',
  'TEST_SHOW_0',
  'TEST_ITERATE',
  'TEST_SHOW',
  'SET_ANSWER',
  'HIDE_MSG',
  'TEST_RESET'
];

export const actionTypes = prefixer(prefix, actionTypesList);

async function forStepPermission(time, getState) {
  const prev = getState().PVSAT;
  await timeOut(time);
  const next = getState().PVSAT;
  return prev.currentStep === next.currentStep && prev.session === next.session;
}

export function testStart(payload) {
  return dispatch => {
    if (payload.testData.length === 0) return dispatch(testFinish());
    dispatch({ type: actionTypes.TEST_START, payload });
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
    if (step === length) return dispatch(testFinish());
    dispatch({ type: actionTypes.TEST_ITERATE });
    if (await forStepPermission(time.blank, getState)) dispatch(testShow());
  };
}

function testShow() {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.TEST_SHOW });
    if (await forStepPermission(getState().PVSAT.interval, getState))
      dispatch(testCheckTimeOut());
  };
}

function testCheckTimeOut() {
  return async (dispatch, getState) => {
    const { showStatus } = getState().PVSAT;
    if (!showStatus) dispatch(answering(-1));
    if (await forStepPermission(time.msg, getState)) dispatch(testIterate());
  };
}

export function answering(response) {
  return async (dispatch, getState) => {
    const {
      beginTs,
      answer,
      results,
      interval,
      currentStep,
      testData
    } = getState().PVSAT;
    let reactionTime = new Date().getTime() - beginTs;
    if (response < 0) reactionTime = time.interval;
    let feedback;
    if (response < 0) feedback = 'time out';
    else if (response === answer) feedback = 'correct';
    else feedback = 'wrong';
    if (results[currentStep] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          interval,
          question1: testData[currentStep - 1].text,
          question2: testData[currentStep].text,
          answer,
          response,
          correct: response === answer,
          feedback
        })
      );
  };
}

function setAnswer(payload) {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.SET_ANSWER, payload });
    if (await forStepPermission(time.msg, getState))
      dispatch({ type: actionTypes.HIDE_MSG });
  };
}

function testFinish() {
  return (dispatch, getState) => {
    const state = getState().PVSAT;
    state.callBack(state.results);
  };
}

export function testReset() {
  return {
    type: actionTypes.TEST_RESET
  };
}
