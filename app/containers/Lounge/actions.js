'use strict';

import { maxHeight, maxWidth } from './constants';

import cv from 'opencv4nodejs';
import path from 'path';
import prefixer from '../../utils/reducerPrefixer';
import { remote } from 'electron';

const { dialog } = remote;
const { app } = remote;

const prefix = '@@Lounge';
const actionTypesList = [
  'SELECT_NEW_VIDEO',
  'SEND_CANVAS',
  'START_VIDEO',
  'STOP_VIDEO',
  'HANDLE_INPUT_FRAME',
  'UPDATE_FRAME',
  'HANDLE_CHANGE_DIALOG',
  'HANDLE_CANCEL_DIALOG',
  'HANDLE_CONFIRM_DIALOG',
  'HANDLE_OPEN_DIALOG'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function sendCanvas(canvasRef) {
  return {
    type: actionTypes.SEND_CANVAS,
    payload: canvasRef
  };
}

export function openFile() {
  return dispatch => {
    const toLocalPath = path.resolve(app.getPath('desktop'));
    const userChosenPath = dialog.showOpenDialog({
      defaultPath: toLocalPath,
      properties: ['openFile'],
      filters: [
        {
          name: 'Video files',
          extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
        }
      ]
    });
    if (!userChosenPath) return;
    dispatch(selectNewVideo(userChosenPath[0]));
  };
}

function selectNewVideo(path) {
  return async (dispatch, getState) => {
    const { canvasRef } = getState().Lounge;
    const vCap = new cv.VideoCapture(path);
    const width = vCap.get(cv.CAP_PROP_FRAME_WIDTH);
    const height = vCap.get(cv.CAP_PROP_FRAME_HEIGHT);
    const ratio = Math.max(maxWidth / width, maxHeight / height);
    const current = {
      frame: () => vCap.get(cv.CAP_PROP_POS_FRAMES),
      percent: () => vCap.get(cv.CAP_PROP_POS_AVI_RATIO) * 100,
      ms: () => vCap.get(cv.CAP_PROP_POS_MSEC)
    };
    const putFrame = dispatch => {
      dispatch(updateFrame(current));
      const frame = vCap.read();
      if (frame.empty) return false;
      putImage(canvasRef, frame, ratio);
    };
    await dispatch({
      type: actionTypes.SELECT_NEW_VIDEO,
      payload: {
        videoFilePath: path,
        vCap,
        vCapPackage: {
          width,
          height,
          ratio,
          dWidth: width * ratio,
          dHeight: height * ratio,
          FPS: vCap.get(cv.CAP_PROP_FPS),
          length: vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1,
          current,
          putFrame
        }
      }
    });
    putFrame(dispatch);
  };
}

function putImage(canvasRef, _frame, ratio) {
  const frame = ratio ? _frame.rescale(ratio) : _frame;
  const matRGBA =
    frame.channels === 1
      ? frame.cvtColor(cv.COLOR_GRAY2RGBA)
      : frame.cvtColor(cv.COLOR_BGR2RGBA);
  const imgData = new ImageData(
    new Uint8ClampedArray(matRGBA.getData()),
    frame.cols,
    frame.rows
  );
  canvasRef.current.getContext('2d').putImageData(imgData, 0, 0);
}

export function startVideo() {
  return async (dispatch, getState) => {
    const {
      vCapPackage: { putFrame, FPS }
    } = getState().Lounge;
    await dispatch({ type: actionTypes.START_VIDEO });
    const begin = Date.now();
    const playVideo = async () => {
      const { isPlaying } = getState().Lounge;
      if (!isPlaying) return;
      putFrame(dispatch);
      const delay = 1000 / FPS - (Date.now() - begin);
      setTimeout(playVideo, delay);
    };
    setTimeout(playVideo, 0);
  };
}

function updateFrame(current) {
  return {
    type: actionTypes.UPDATE_FRAME,
    payload: {
      frame: current.frame(),
      ms: current.ms(),
      percent: current.percent()
    }
  };
}

export function stopVideo() {
  return { type: actionTypes.STOP_VIDEO };
}

export function handleInputFrame(e) {
  const { value } = Number(e.target);
  return {
    type: actionTypes.HANDLE_INPUT_FRAME,
    payload: value
  };
}

export function previousFrame() {
  return (dispatch, getState) => {
    const {
      vCap,
      vCapPackage: { putFrame, current }
    } = getState().Lounge;
    let currentFrame = current.frame();
    if (currentFrame - 1 >= 0) currentFrame -= 2;
    else currentFrame = 0;
    setFrameByType(vCap, currentFrame, 'frame');
    putFrame(dispatch);
  };
}

export function nextFrame() {
  return (dispatch, getState) => {
    const {
      vCapPackage: { putFrame }
    } = getState().Lounge;
    putFrame(dispatch);
  };
}

export function rewindFrame() {
  return (dispatch, getState) => {
    const {
      vCap,
      vCapPackage: { putFrame, current, FPS }
    } = getState().Lounge;
    let currentFrame = current.frame();
    if (currentFrame - FPS - 1 >= 0) currentFrame -= FPS + 1;
    else currentFrame = 0;
    setFrameByType(vCap, currentFrame, 'frame');
    putFrame(dispatch);
  };
}

export function skipFrame() {
  return (dispatch, getState) => {
    const {
      vCap,
      vCapPackage: { putFrame, current, length, FPS }
    } = getState().Lounge;
    let currentFrame = current.frame();
    if (currentFrame + FPS <= length) currentFrame += FPS - 1;
    else currentFrame = length;
    setFrameByType(vCap, currentFrame, 'frame');
    putFrame(dispatch);
  };
}

export function handleOpenDialog(type) {
  return (dispatch, getState) => {
    const {
      vCapPackage: { length, FPS }
    } = getState().Lounge;
    const dialog = { open: true, type, value: 0 };
    switch (type) {
      case 'frame':
        dialog.maxValue = length;
        break;
      case 'ms':
        dialog.maxValue = (length * 1000) / FPS;
        break;
      case 'percent':
        dialog.maxValue = 100;
        break;
      default:
        dialog.open = false;
        dialog.type = '';
        dialog.value = null;
        dialog.maxValue = null;
    }
    dispatch({
      type: actionTypes.HANDLE_OPEN_DIALOG,
      payload: dialog
    });
  };
}

export function handleChangeDialog(e) {
  return (dispatch, getState) => {
    const {
      dialog: { type }
    } = getState().Lounge;
    let { value } = e.target;
    switch (type) {
      case 'frame':
        value = parseInt(value, 10);
        if (isNaN(value)) return;
        break;
      case 'ms':
      case 'percent':
        value = parseFloat(value);
        if (isNaN(value)) return;
        break;
      default:
    }
    dispatch({
      type: actionTypes.HANDLE_CHANGE_DIALOG,
      payload: value
    });
  };
}

export function handleCancelDialog() {
  return {
    type: actionTypes.HANDLE_CANCEL_DIALOG
  };
}

function setFrameByType(vCap, value, mode) {
  switch (mode) {
    case 'frame':
      return vCap.set(cv.CAP_PROP_POS_FRAMES, value);
    case 'ms':
      return vCap.set(cv.CAP_PROP_POS_MSEC, value);
    case 'percent':
      return vCap.set(cv.CAP_PROP_POS_AVI_RATIO, value / 100);
    default:
  }
}

export function handleConfirmDialog() {
  return (dispatch, getState) => {
    const {
      dialog,
      vCap,
      vCapPackage: { putFrame }
    } = getState().Lounge;
    dispatch({ type: actionTypes.HANDLE_CONFIRM_DIALOG });
    setFrameByType(vCap, dialog.value, dialog.type);
    putFrame(dispatch);
  };
}

export function handleKeyDownDialog(e) {
  return dispatch => {
    if (e.key === 'Enter') {
      dispatch(handleConfirmDialog());
    }
  };
}
