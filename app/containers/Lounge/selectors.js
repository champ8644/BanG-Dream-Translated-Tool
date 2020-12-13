'use strict';

import { initialState, initialVideoDatas } from './reducers';

import { createSelector } from 'reselect';
import path from 'path';

const make = (state, props) => (state ? state.Lounge : {});
const vCapSelector = state => state.Lounge.vCap;
const frameSelector = state => state.Lounge.frame;
const pathSelector = state => state.Lounge.videoFilePath;

export const makeCurrentFrame = createSelector(
  vCapSelector,
  frameSelector,
  (vCap, frame) => {
    if (!vCap) return { frame: null, ms: null, percent: null };
    vCap.setFrame(frame);
    return { frame, ms: vCap.ms(), percent: vCap.percent() };
  }
);

export const makeVideoFilePath = createSelector(
  pathSelector,
  filePath =>
    filePath
      ? {
          videoFilePath: filePath,
          videoFileName: path.basename(filePath)
        }
      : {
          videoFilePath: initialState.videoFilePath,
          videoFileName: ''
        }
);

export const makeVideoCapture = createSelector(
  vCapSelector,
  vCap => vCap || initialState.vCap
);

export const makeDialogData = createSelector(
  make,
  state => (state ? state.dialog : initialState.dialog)
);

export const makeStatusData = createSelector(
  make,
  state => (state ? state.status : initialState.status)
);

export const makeSlider = createSelector(
  make,
  state => (state ? state.valueSlider : initialState.valueSlider)
);

export const makeProgress = createSelector(
  make,
  state => (state ? state.progress : initialState.progress)
);

export const makeProgressBar = createSelector(
  make,
  state => (state ? state.progressFull : initialState.progressFull)
);

export const makeWillUpdateNextFrame = createSelector(
  make,
  state =>
    state ? state.willUpdateNextFrame : initialState.willUpdateNextFrame
);

export const makeOverlayMode = createSelector(
  make,
  state => (state ? state.overlayMode : initialState.overlayMode)
);

export const makeSliderObj = createSelector(
  make,
  state => (state ? state.sliderObj : initialState.sliderObj)
);

export const makeNumProcess = createSelector(
  make,
  state => (state ? state.numProcess : initialState.numProcess)
);

export const makeDisplayNumProcess = createSelector(
  make,
  state => (state ? state.displayNumProcess : initialState.displayNumProcess)
);

export const makeQueue = createSelector(
  make,
  state => (state ? state.queue : initialState.queue)
);

export const makeWorkingStatus = createSelector(
  make,
  state => (state ? state.workingStatus : initialState.workingStatus)
);

export const makeCloseConvertingDialog = createSelector(
  make,
  state =>
    state ? state.closeConvertingDialog : initialState.closeConvertingDialog
);
const getVideoDatas = (state, props) =>
  props.path && state.Lounge && state.Lounge.videoDatas
    ? state.Lounge.videoDatas[props.path]
    : initialVideoDatas;

export const makePercentLinear = createSelector(
  getVideoDatas,
  videoData =>
    videoData
      ? videoData.progressFromWorker
      : initialVideoDatas.progressFromWorker
);

export const makeReadyToWork = createSelector(
  getVideoDatas,
  videoData =>
    videoData ? videoData.readyToWork : initialVideoDatas.readyToWork
);

export const makeCompleteWork = createSelector(
  getVideoDatas,
  videoData =>
    videoData ? videoData.completeWork : initialVideoDatas.completeWork
);

export const makeCancelWork = createSelector(
  getVideoDatas,
  videoData => (videoData ? videoData.cancelWork : initialVideoDatas.cancelWork)
);

export const makeShowFPS = createSelector(
  getVideoDatas,
  videoData => (videoData ? videoData.showFPS : initialVideoDatas.showFPS)
);

export const makeVideoCaptureEach = () =>
  createSelector(
    getVideoDatas,
    videoData => (videoData ? videoData.vCap : initialVideoDatas.vCap)
  );

const makeIsEvent = createSelector(
  getVideoDatas,
  videoData => (videoData ? videoData.isEvent : initialVideoDatas.isEvent)
);

const makeAssPath = createSelector(
  getVideoDatas,
  videoData => (videoData ? videoData.assPath : initialVideoDatas.assPath)
);

export const makeProgressMultiBarProps = () =>
  createSelector(
    makePercentLinear,
    makeReadyToWork,
    makeCancelWork,
    makeCompleteWork,
    makeShowFPS,
    makeNumProcess,
    makeIsEvent,
    makeAssPath,
    (
      percentLinear,
      readyToWork,
      cancelWork,
      completeWork,
      showFPS,
      NUM_PROCESS,
      isEvent,
      assPath
    ) => ({
      percentLinear,
      readyToWork,
      cancelWork,
      completeWork,
      showFPS,
      NUM_PROCESS,
      isEvent,
      assPath
    })
  );

const getMainVideoData = createSelector(
  make,
  state =>
    state.vCap && state.vCap.path
      ? state.videoDatas[state.vCap.path]
      : initialVideoDatas
);

export const makeMainPercentLinear = createSelector(
  getMainVideoData,
  videoData =>
    videoData
      ? videoData.progressFromWorker
      : initialVideoDatas.progressFromWorker
);

export const makeMainReadyToWork = createSelector(
  getMainVideoData,
  videoData =>
    videoData ? videoData.readyToWork : initialVideoDatas.readyToWork
);

export const makeMainCompleteWork = createSelector(
  getMainVideoData,
  videoData =>
    videoData ? videoData.completeWork : initialVideoDatas.completeWork
);

export const makeMainCancelWork = createSelector(
  getMainVideoData,
  videoData => (videoData ? videoData.cancelWork : initialVideoDatas.cancelWork)
);

export const makeMainShowFPS = createSelector(
  getMainVideoData,
  videoData => (videoData ? videoData.showFPS : initialVideoDatas.showFPS)
);

export const makeAutoStart = createSelector(
  make,
  state => state.autoStart
);

export const makeWatchPath = createSelector(
  make,
  state => state.watchPath
);

export const makeMainProgressMultiBarProps = () =>
  createSelector(
    makeMainPercentLinear,
    makeMainReadyToWork,
    makeMainCancelWork,
    makeMainCompleteWork,
    makeMainShowFPS,
    makeNumProcess,
    (
      percentLinear,
      readyToWork,
      cancelWork,
      completeWork,
      showFPS,
      NUM_PROCESS
    ) => ({
      percentLinear,
      readyToWork,
      cancelWork,
      completeWork,
      showFPS,
      NUM_PROCESS
    })
  );
