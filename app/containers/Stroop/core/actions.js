'use strict';

import prefixer from '../../../utils/reducerPrefixer';
import { saveTestResults } from '../../MainMenu/actions';
import { time } from '../constants/constant';
import { timeOut } from '../../../utils/asyncHelper';

const prefix = '@@Stroop';
const actionTypesList = [
  'TEST_START',
  'TEST_PRE_X',
  'TEST_X',
  'TEST_POST_X',
  'TEST_INTERVAL',
  'SET_ANSWER',
  'TEST_FINISH',
  'TEST_RESET'
];

export const actionTypes = prefixer(prefix, actionTypesList);

function _testStart(payload) {
  return {
    type: actionTypes.TEST_START,
    payload
  };
}

export function testStart(props) {
  return dispatch => {
    dispatch(_testStart(props));
    dispatch(testIterate());
  };
}

function testIterate() {
  return async (dispatch, getState) => {
    const {
      currentStep,
      length,
      testData,
      session,
      interval
    } = getState().Stroop;
    const currentSession = { currentStep: currentStep + 1, session };
    if (currentStep + 1 === length) {
      dispatch(testFinish());
      return;
    }
    const { color, background: backgroundColor, text, answer } = testData[
      currentStep + 1
    ];
    dispatch(testPreX());
    await timeOut(time.preX);
    if (isOutDate(currentSession, getState().Stroop)) return;
    dispatch(testX());
    await timeOut(time.X);
    if (isOutDate(currentSession, getState().Stroop)) return;
    dispatch(testPostX());
    await timeOut(time.postX);
    if (isOutDate(currentSession, getState().Stroop)) return;
    dispatch(testInterval({ color, backgroundColor, text, answer }));
    await timeOut(interval);
    if (isOutDate(currentSession, getState().Stroop)) return;
    dispatch(answerTimeOut());
  };
}

function isOutDate(prev, next) {
  if (prev.currentStep !== next.currentStep) return true;
  if (prev.session !== next.session) return true;
  return false;
}

function testPreX() {
  return {
    type: actionTypes.TEST_PRE_X
  };
}
function testX() {
  return {
    type: actionTypes.TEST_X
  };
}
function testPostX() {
  return {
    type: actionTypes.TEST_POST_X
  };
}
function testInterval(payload) {
  return {
    type: actionTypes.TEST_INTERVAL,
    payload
  };
}

function _setAnswer(payload) {
  return {
    type: actionTypes.SET_ANSWER,
    payload
  };
}

function setAnswer(payload) {
  return async (dispatch, getState) => {
    const { currentStep, session } = getState().Stroop;
    dispatch(_setAnswer(payload));
    await timeOut(time.answer);
    if (isOutDate({ currentStep, session }, getState().Stroop)) return;
    // dispatch(answerTimeOut());
    dispatch(testIterate());
  };
}

function answerTimeOut() {
  return async (dispatch, getState) => {
    const state = getState().Stroop;
    const reactionTime = state.interval;
    if (state.results[state.currentState] === undefined)
      dispatch(
        setAnswer({
          reactionTime,
          correct: false,
          type: 'time out',
          response: '',
          progress: 100
        })
      );
  };
}

export function answerCorrect(response) {
  return async (dispatch, getState) => {
    const state = getState().Stroop;
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
    const state = getState().Stroop;
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

function testFinish() {
  return (dispatch, getState) => {
    const { results, callBack, mode, subtype } = getState().Stroop;
    if (mode !== 'DEMO')
      dispatch(
        saveTestResults({
          type: 'Stroop',
          subtype,
          mode,
          results: makeStroopReport(results)
        })
      );
    dispatch(_testFinish(results));
    callBack();
  };
}

function _testFinish() {
  return {
    type: actionTypes.TEST_FINISH
  };
}

export function testReset() {
  return {
    type: actionTypes.TEST_RESET
  };
}

function makeStroopReport(resultsObj) {
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
  analyse.correct = results.reduce(
    (base, { correct: ans }) => (ans ? base + 1 : base),
    0
  );
  analyse.accuracy = (analyse.correct * 100) / results.length;
  analyse.length = results.length;
  return { analyse, results };
}
