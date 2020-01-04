'use strict';

import { maxHeight, maxWidth } from './constants';

import Queue from '../../classes/Queue';
import XLSX from 'xlsx';
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
  'HANDLE_OPEN_DIALOG',
  'HANDLE_CANVAS_CLICK',
  'HANDLE_CHANGE_SLIDER',
  'STOP_PROGRESS',
  'START_PROGRESS',
  'ADD_PROGRESS'
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
    const length = vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1;
    const current = {
      frame: () => vCap.get(cv.CAP_PROP_POS_FRAMES),
      percent: () => {
        return (vCap.get(cv.CAP_PROP_POS_FRAMES) / length) * 100;
      },
      ms: () => vCap.get(cv.CAP_PROP_POS_MSEC)
    };
    const putFrame = _frame => dispatch => {
      dispatch(updateFrame(current));
      let frame;
      if (_frame) frame = _frame;
      else frame = vCap.read();
      if (frame.empty) return false;
      findTextBubble(frame);
      putImage(canvasRef, frame, ratio);
      if (_frame) return true;
      frame.release();
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
          length,
          current,
          putFrame
        }
      }
    });
    dispatch(putFrame());
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
  frame.release();

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
      dispatch(putFrame());
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

function rewindOneFrame(vCap) {
  let currentFrame = vCap.get(cv.CAP_PROP_POS_FRAMES);
  if (currentFrame - 1 >= 0) currentFrame--;
  else currentFrame = 0;
  setFrameByType(vCap, currentFrame, 'frame');
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
    dispatch(putFrame());
  };
}

export function nextFrame() {
  return (dispatch, getState) => {
    const {
      vCapPackage: { putFrame }
    } = getState().Lounge;
    dispatch(putFrame());
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
    dispatch(putFrame());
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
    dispatch(putFrame());
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
    setFrameByType(
      vCap,
      dialog.type === 'percent' ? dialog.value / 100 : dialog.value,
      dialog.type
    );
    dispatch(putFrame());
  };
}

export function handleKeyDownDialog(e) {
  return dispatch => {
    if (e.key === 'Enter') {
      dispatch(handleConfirmDialog());
    }
  };
}

// eslint-disable-next-line no-unused-vars
async function findBorder(frame, initX, initY, putFrame) {
  const queue = new Queue();
  const visitX = {};
  const visitY = {};
  const addVisit = (x, y) => {
    if (!visitX[x]) visitX[x] = {};
    if (!visitY[y]) visitY[y] = {};
    visitX[x][y] = true;
    visitY[y][x] = true;
  };
  const dir = [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];
  const isColorBright = (x, y) => {
    const [b, g, r] = frame.atRaw(y, x);
    const threshold = 235;
    return threshold < b && threshold < g && threshold < r;
  };
  const isValid = (x, y) => {
    if (x < 0 || y < 0) return false;
    if (frame.cols <= x || frame.rows <= y) return false;
    if (visitX[x]) {
      if (visitX[x][y]) return false;
    }
    return isColorBright(x, y);
  };
  queue.enqueue({ x: initX, y: initY });

  while (queue.getLength()) {
    const { x, y } = queue.dequeue();
    addVisit(x, y);
    frame.set(y, x, [255, 0, 0]);
    putFrame(frame);
    dir.forEach(({ x: addX, y: addY }) => {
      const _x = x + addX;
      const _y = y + addY;
      if (isValid(_x, _y)) queue.enqueue({ x: _x, y: _y });
    });
  }
}

function isFinalContour(contour) {
  if (contour.width < 130) return false;
  if (contour.height < 130) return false;
  const rect = contour.boundingRect();
  if (rect.width <= rect.height) return false;
  const percent = (contour.area / rect.width / rect.height) * 100;
  if (percent < 80) return false;
  return true;
}

function findTextBubble(frame) {
  const red = new cv.Vec(0, 0, 255);
  const green = new cv.Vec(0, 255, 0);
  const blue = new cv.Vec(255, 0, 0);
  const contours = frame
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(240, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  const outObj = [];
  contours.forEach(item => {
    // if (item.area > 5000) {
    const peri = item.arcLength(true);
    const approx = item.approxPolyDP(0.04 * peri, true);
    if (approx.length === 4) {
      const approxContour = new cv.Contour(approx);
      if (isFinalContour(approxContour)) {
        const finalRect = approxContour.boundingRect();
        outObj.push(finalRect);
        frame.drawContours([approx], -1, blue, 1);
        frame.drawContours([item.getPoints()], -1, green, 1);
        frame.drawRectangle(item.boundingRect(), green, 1);
        frame.drawRectangle(finalRect, red, 3);
        frame.drawCircle(
          new cv.Point(
            finalRect.x + finalRect.width / 2,
            finalRect.y + finalRect.height / 2
          ),
          5,
          red,
          10,
          cv.FILLED
        );
      }
      // }
    }
  });
  return outObj;
}

export function handleCanvasClick(_event) {
  return (dispatch, getState) => {
    const {
      canvasRef,
      vCap,
      vCapPackage: { ratio, putFrame }
      // valueSlider
    } = getState().Lounge;
    let event = {};
    const {
      left: offsetLeft,
      top: offsetTop
    } = canvasRef.current.getBoundingClientRect();
    if (_event) event = _event;
    else
      event = {
        clientX: offsetLeft,
        clientY: offsetTop
      };
    let { clientX, clientY } = event;
    clientX -= offsetLeft;
    clientY -= offsetTop;
    clientX /= ratio;
    clientY /= ratio;
    rewindOneFrame(vCap);
    const frame = vCap.read();
    const [b, g, r] = frame.atRaw(clientY, clientX);
    findTextBubble(frame);
    const green = new cv.Vec(0, 255, 0);
    frame.drawCircle(new cv.Point(clientX, clientY), 5, green, 10, cv.FILLED);
    dispatch(putFrame(frame));
    frame.release();
    dispatch({
      type: actionTypes.HANDLE_CANVAS_CLICK,
      payload: { clientX, clientY, show: true, color: fullColorHex(r, g, b) }
    });
  };
}

function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = `0${hex}`;
  }
  return hex;
}

function fullColorHex(r, g, b) {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);
  return `#${red}${green}${blue}`;
}

function changeSlider(value) {
  return dispatch => {
    dispatch({
      type: actionTypes.HANDLE_CHANGE_SLIDER,
      payload: value
    });
    dispatch(handleCanvasClick());
  };
}

export function handleChangeSlider(e, value) {
  return changeSlider(value);
}

export function handleInputChange(e) {
  return dispatch => {
    if (e.target.value === '') return changeSlider(0);
    let num = parseFloat(e.target.value);
    if (isNaN(num)) return;
    if (num < 0) num = 0;
    else if (num > 100) num = 100;
    return changeSlider(num);
  };
}

// export function handleInputBlur(e, value) {
//   return (dispatch, getState) => {
//     return {
//       type: actionTypes.HANDLE_INPUT_BLUR,
//       payload: value
//     };
//   };
// }

function rectToCenterPt(rect) {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function findDist(pt1, pt2) {
  return (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y);
}

export function exporting() {
  return async (dispatch, getState) => {
    const {
      canvasRef,
      vCap,
      vCapPackage: { ratio, putFrame }
    } = getState().Lounge;
    const [beginTime, endTime] = [200, 400];
    let maxArea = 0;
    let maxItemIndex;
    let maxArrayIndex;
    dispatch(startProgress(endTime - beginTime + 1));
    setFrameByType(vCap, beginTime, 'frame');
    const outArr = [];
    for (let i = beginTime; i < endTime; i++) {
      const {
        progressFull,
        vCapPackage: { current }
      } = getState().Lounge;
      if (!progressFull) return;
      const frame = vCap.read();

      dispatch(putFrame(frame));
      const obj = { ms: current.ms(), frame: current.frame() };
      if (frame.empty) return false;
      obj.arr = findTextBubble(frame);
      outArr.push(obj);
      for (let j = 0; j < obj.arr.length; j++) {
        const item = obj.arr[j];
        const area = item.width * item.height;
        if (maxArea < area) {
          maxArea = area;
          maxItemIndex = j;
          maxArrayIndex = outArr.length - 1;
        }
      }
      putImage(canvasRef, frame, ratio);
      frame.release();
      dispatch(addProgress(1));
    }
    const trueOutput = [];
    const makeObjOutput = (keyFrame, keyRect) => {
      const { arr, ms, frame } = outArr[keyFrame];
      const rect = arr[keyRect];
      const { width, height } = rect;
      const pt1 = { x: rect.x, y: rect.y };
      const pt2 = { x: rect.x + width, y: rect.y + height };
      const center = { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };
      return {
        centerX: center.x,
        centerY: center.y,
        left: center.x - (width / 2) * 0.9,
        top: center.y - (height / 2) * 0.9,
        right: center.x + (width / 2) * 0.9,
        bottom: center.y + (height / 2) * 0.9,
        width,
        height,
        area: width * height,
        ms,
        frame
      };
    };
    trueOutput.push(makeObjOutput(maxArrayIndex, maxItemIndex));
    const orgPt = { x: trueOutput[0].centerX, y: trueOutput[0].centerY };

    let prevPt = orgPt;
    // console.log('trueOutput: ', { trueOutput, maxArrayIndex, maxItemIndex });
    for (let i = maxArrayIndex - 1; i > 0; i--) {
      const { arr } = outArr[i];
      if (arr.length > 0) {
        let minDist = 999999999;
        let pickKey;
        for (let j = 0; j < arr.length; j++) {
          const dist = findDist(prevPt, rectToCenterPt(arr[j]));
          if (minDist > dist) {
            minDist = dist;
            pickKey = j;
          }
        }
        trueOutput.unshift(makeObjOutput(i, pickKey));
        prevPt = rectToCenterPt(arr[pickKey]);
      }
    }
    prevPt = orgPt;
    for (let i = maxArrayIndex + 1; i < outArr.length; i++) {
      const { arr } = outArr[i];
      if (arr.length > 0) {
        let minDist = 999999999;
        let pickKey;
        for (let j = 0; j < arr.length; j++) {
          const dist = findDist(orgPt, rectToCenterPt(arr[j]));
          if (minDist > dist) {
            minDist = dist;
            pickKey = j;
          }
        }
        trueOutput.push(makeObjOutput(i, pickKey));
        prevPt = rectToCenterPt(arr[pickKey]);
      }
    }
    const header = [
      'frame',
      'ms',
      'left',
      'top',
      'right',
      'bottom',
      'centerX',
      'centerY',
      'width',
      'height',
      'area'
    ];
    const userChosenPath = dialog.showSaveDialog({
      filters: [{ name: 'Excel files', extensions: ['xlsx'] }]
    });
    const worksheet = XLSX.utils.json_to_sheet(trueOutput, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BanG_Dream');
    XLSX.writeFile(workbook, userChosenPath);
    dispatch(stopProgress());
  };
}

function stopProgress() {
  return {
    type: actionTypes.STOP_PROGRESS
  };
}

function startProgress(maxVal) {
  return {
    type: actionTypes.START_PROGRESS,
    payload: maxVal
  };
}

function addProgress(val) {
  return {
    type: actionTypes.ADD_PROGRESS,
    payload: val
  };
}
