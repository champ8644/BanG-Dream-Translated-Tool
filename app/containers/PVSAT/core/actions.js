'use strict';

import prefixer from '../../../utils/reducerPrefixer';
import { saveTestResults } from '../../MainMenu/actions';
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
  return async dispatch => {
    if (payload.testData.length === 0) return dispatch(testFinish());
    dispatch({
      type: actionTypes.TEST_START,
      payload: { ...payload, length: payload.testData.length }
    });
    await timeOut(1);
    dispatch(testShow0());
  };
}

function testShow0() {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.TEST_SHOW_0 });
    if (await forStepPermission(getState().PVSAT.interval, getState))
      dispatch(testIterate());
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
    const { mode } = getState().PVSAT;
    dispatch({ type: actionTypes.TEST_SHOW });
    if (mode !== 'DEMO')
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
    let question1 = null;
    let question2 = null;
    if (testData !== undefined) {
      question1 = testData[currentStep - 1].text;
      question2 = testData[currentStep].text;
    }
    let reactionTime = new Date().getTime() - beginTs;
    let feedback;
    if (reactionTime > interval) {
      reactionTime = interval;
      feedback = 'time out';
    } else if (response === answer) feedback = 'correct';
    else feedback = 'wrong';
    if (results[currentStep] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          percentReactionTime: (reactionTime * 100) / interval,
          question1,
          question2,
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
    const { mode } = getState().PVSAT;
    dispatch({ type: actionTypes.SET_ANSWER, payload });
    if (await forStepPermission(time.msg, getState)) {
      dispatch({ type: actionTypes.HIDE_MSG });
      if (mode === 'DEMO') dispatch(testIterate());
    }
  };
}

function testFinish() {
  return (dispatch, getState) => {
    const { results, callBack, mode } = getState().PVSAT;
    if (mode !== 'DEMO')
      dispatch(
        saveTestResults({
          type: 'PVSAT',
          subtype: 'test',
          mode,
          results: makePVSATReport(results)
        })
      );
    dispatch({ type: actionTypes.TEST_RESET });
    callBack();
  };
}

function makePVSATReport(resultsObj) {
  const results = Object.keys(resultsObj).map(key => resultsObj[key]);
  const analyse = {};
  analyse.sum = results.reduce((base, { reactionTime: x }) => base + x, 0);
  analyse.avg = analyse.sum / results.length;
  analyse.variance =
    results.reduce(
      (base, { reactionTime: x }) =>
        base + (x - analyse.avg) * (x - analyse.avg),
      0
    ) / results.length;
  analyse.SD = Math.sqrt(analyse.variance);
  analyse.min = results.reduce(
    (base, { reactionTime: x }) => (base > x ? x : base),
    999999
  );
  analyse.max = results.reduce(
    (base, { reactionTime: x }) => (base < x ? x : base),
    -999999
  );
  analyse.sumCorrect = results.reduce(
    (base, { correct: ans }) => (ans ? base + 1 : base),
    0
  );
  analyse.accuracy = (analyse.sumCorrect * 100) / results.length;
  return { analyse, results };
}

export function testReset() {
  return {
    type: actionTypes.TEST_RESET
  };
}
