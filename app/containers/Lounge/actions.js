'use strict';

/* eslint-disable no-console */

import { gapConst, maxMinDist } from './constants';

import Queue from '../../classes/Queue';
import VideoCapture from './VideoCapture';
import XLSX from 'xlsx';
import _ from 'lodash';
import cv from 'opencv4nodejs';
import mainEvent from './mainFunctions/mainEvent';
import { message2Worker } from './utils';
import prefixer from '../../utils/reducerPrefixer';
import { remote } from 'electron';

const { dialog } = remote;

const prefix = '@@Lounge';
const actionTypesList = [
  'SELECT_NEW_VIDEO',
  'UPDATE_FRAME',
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
  'ADD_PROGRESS',
  'IMPORTING',
  'HANDLE_RADIO_SELECT',
  'HANDLE_COMMITTED_SLIDER',
  'UPDATE_LINEAR'
];

export const actionTypes = prefixer(prefix, actionTypesList);

export function sendMessage(timeLimit) {
  return (dispatch, getState) => {
    const { videoFilePath } = getState().Lounge;
    message2Worker('start-events', { videoFilePath, timeLimit });
  };
}

export function updateLinear(percent) {
  return {
    type: actionTypes.UPDATE_LINEAR,
    payload: percent
  };
}

export function sendCanvas(canvasRef) {
  return {
    type: actionTypes.SEND_CANVAS,
    payload: canvasRef
  };
}

export function openFile() {
  return (dispatch, getState) => {
    const { canvasRef, valueSlider, overlayMode } = getState().Lounge;
    const userChosenPath = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Video files',
          extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
        }
      ]
    });
    if (!userChosenPath) return;
    const vCap = new VideoCapture({
      path: userChosenPath[0],
      canvas: canvasRef,
      updateFrame: async () => dispatch(updateFrame()),
      colorSlider: valueSlider,
      modePostProcessor: overlayMode
    });
    dispatch({
      type: actionTypes.SELECT_NEW_VIDEO,
      payload: {
        videoFilePath: userChosenPath[0],
        vCap
      }
    });
  };
}

export function updateFrame() {
  return {
    type: actionTypes.UPDATE_FRAME
  };
}

export function startVideo() {
  return async (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.play();
  };
}

export function stopVideo() {
  return async (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.stop();
  };
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
    const { vCap } = getState().Lounge;
    vCap.step(-1);
    dispatch(updateFrame());
  };
}

export function nextFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(1);
    dispatch(updateFrame());
  };
}

export function rewindFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(-1000, 'ms');
    dispatch(updateFrame());
  };
}

export function skipFrame() {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.step(1000, 'ms');
    dispatch(updateFrame());
  };
}

export function handleOpenDialog(type) {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    const dialog = { open: true, type, value: 0 };
    switch (type) {
      case 'frame':
        dialog.maxValue = vCap.length;
        break;
      case 'ms':
        dialog.maxValue = (vCap.length * 1000) / vCap.FPS;
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
    if (value === '') value = 0;
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

export function handleConfirmDialog() {
  return (dispatch, getState) => {
    const { dialog, vCap } = getState().Lounge;
    dispatch({ type: actionTypes.HANDLE_CONFIRM_DIALOG });
    vCap.show(dialog.value, dialog.type);
    dispatch(updateFrame());
  };
}

export function handleKeyDownDialog(e) {
  return dispatch => {
    if (e.key === 'Enter') {
      dispatch(handleConfirmDialog());
    }
  };
}

export function handleRadioSelect(e) {
  return (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    vCap.setPostProcessor(e.target.value);
    vCap.show();
    dispatch({
      type: actionTypes.HANDLE_RADIO_SELECT,
      payload: e.target.value
    });
  };
}

function makeGap(x) {
  let a = x - gapConst;
  let b = x + gapConst;
  if (a < 0) a = 0;
  if (b > 255) b = 255;
  return [a, b];
}

export function handleCanvasClick(_event) {
  return (dispatch, getState) => {
    const { canvasRef, vCap, overlayMode } = getState().Lounge;
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
    clientX /= vCap.ratio;
    clientY /= vCap.ratio;
    const [b, g, r] = vCap.locatedClicked(clientX, clientY);
    let newValueSlider = null;
    switch (overlayMode) {
      case 'BGRFinder':
        if (!newValueSlider) {
          newValueSlider = {
            blue: makeGap(b),
            green: makeGap(g),
            red: makeGap(r)
          };
        }
      // eslint-disable-next-line no-fallthrough
      case 'HSVFinder':
        if (!newValueSlider) {
          const [h, s, v] = new cv.Mat(1, 1, cv.CV_8UC3, [b, g, r])
            .cvtColor(cv.COLOR_BGR2HSV)
            .atRaw(0, 0);
          newValueSlider = {
            hue: makeGap(h),
            sat: makeGap(s),
            val: makeGap(v)
          };
        }
        vCap.changeColorSlider(newValueSlider);
        dispatch({
          type: actionTypes.HANDLE_COMMITTED_SLIDER,
          payload: newValueSlider
        });
        break;
      default:
    }
    dispatch({
      type: actionTypes.HANDLE_CANVAS_CLICK,
      payload: {
        clientX,
        clientY,
        show: true,
        color: { hex: fullColorHex(r, g, b), r, b, g }
      }
    });
  };
}

export function mainEventBtn() {
  return async (dispatch, getState) => {
    const { vCap } = getState().Lounge;
    mainEvent(vCap);
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

export function handleChangeSlider(name, value) {
  return {
    type: actionTypes.HANDLE_CHANGE_SLIDER,
    payload: { [name]: value }
  };
}

export function handleCommittedSlider() {
  return (dispatch, getState) => {
    const { vCap, valueSlider } = getState().Lounge;
    vCap.changeColorSlider(valueSlider);
    return {
      type: actionTypes.HANDLE_COMMITTED_SLIDER,
      payload: vCap.colorSlider
    };
  };
}

// export function handleInputChange(e) {
//   return dispatch => {
//     if (e.target.value === '') return changeSlider(0);
//     let num = parseFloat(e.target.value);
//     if (isNaN(num)) return;
//     if (num < 0) num = 0;
//     else if (num > 100) num = 100;
//     return dispatch(changeSlider(num));
//   };
// }

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
      // canvasRef,
      vCap,
      vCapPackage: { putFrame }
    } = getState().Lounge;
    const [beginTime, endTime] = [200, 400];
    let maxArea = 0;
    let maxItemIndex;
    let maxArrayIndex;
    dispatch(startProgress(endTime - beginTime + 1));
    // setFrameByType(vCap, beginTime, 'frame');
    const outArr = [];
    for (let i = beginTime; i < endTime; i++) {
      const {
        progressFull,
        vCapPackage: { current }
      } = getState().Lounge;
      if (!progressFull) return;
      const obj = { ms: current.ms(), frame: current.frame() };
      const frame = vCap.read();

      dispatch(putFrame(frame));

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
      // putImage(canvasRef, frame, ratio);
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
        pt1,
        pt2,
        center,
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
    const colDist = [];
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
        if (minDist > maxMinDist) break;
        colDist.push({ frame: i, minDist });
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
          const dist = findDist(prevPt, rectToCenterPt(arr[j]));
          if (minDist > dist) {
            minDist = dist;
            pickKey = j;
          }
        }
        if (minDist > maxMinDist) break;
        colDist.push({ frame: i, minDist });
        trueOutput.push(makeObjOutput(i, pickKey));
        prevPt = rectToCenterPt(arr[pickKey]);
      }
    }
    /*
    let ii = 200;
    const contourY = trueOutput.map(item => {
      return new cv.Point2(ii++, item.centerY);
    });

    rewindOneFrame(vCap);
    const frame = vCap.read();
    const blue = new cv.Vec(255, 0, 0);
    frame.drawContours([contourY], -1, blue, 3);
    dispatch(putFrame(frame));
    frame.release();

    console.log('trueOutput: ', trueOutput);
*/
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
    if (!userChosenPath) return;
    const worksheet = XLSX.utils.json_to_sheet(trueOutput, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BanG_Dream');
    XLSX.writeFile(workbook, userChosenPath);
    dispatch(stopProgress());
  };
}

export function importing() {
  return async (dispatch, getState) => {
    const {
      vCap,
      vCapPackage: { putFrame, FPS },
      importedFile,
      valueSlider
    } = getState().Lounge;
    let data = importedFile;
    if (!data) {
      const o = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx', 'csv'] }]
      });
      const workbook = XLSX.readFile(o[0]);
      const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(firstWorksheet);
      dispatch({
        type: actionTypes.IMPORTING,
        payload: data
      });
    }

    const approxContour = _item => {
      const item = new cv.Contour(_item);
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.0001 * valueSlider * peri, true);
      return approx;
    };
    const subtract = 0;
    const multiply = 1;
    const div = 1;
    console.log('data: ', data);

    let prev = data[0];
    console.log(
      'delta',
      data.map(item => {
        console.log('item: ', item);
        let { centerX, centerY, height, width } = item;
        centerX -= prev.centerX;
        centerY -= prev.centerY;
        height -= prev.height;
        width -= prev.width;
        prev = item;
        return { centerX, centerY, height, width };
      })
    );
    const contourY = approxContour(
      data.map(item => {
        const out = new cv.Point2(
          (item.frame - subtract) * multiply,
          item.centerY
        );
        return out;
      }),
      false
    );
    const contourX = approxContour(
      data.map(item => {
        const out = new cv.Point2(
          (item.frame - subtract) * multiply,
          item.centerX / div
        );
        return out;
      }),
      false
    );
    const contourW = approxContour(
      data.map(item => {
        const out = new cv.Point2(
          (item.frame - subtract) * multiply,
          item.width
        );
        return out;
      }),
      false
    );
    const contourH = approxContour(
      data.map(item => {
        const out = new cv.Point2(
          (item.frame - subtract) * multiply,
          item.height
        );
        return out;
      }),
      false
    );
    // contourX.sort((a, b) => a.x - b.x);
    // contourY.sort((a, b) => a.x - b.x);
    // contourW.sort((a, b) => a.x - b.x);
    // contourH.sort((a, b) => a.x - b.x);
    // rewindOneFrame(vCap);
    const frame = vCap.read();
    const blue = new cv.Vec(255, 0, 0);
    const red = new cv.Vec(0, 0, 255);
    const yellow = new cv.Vec(0, 255, 255);
    const green = new cv.Vec(0, 255, 0);
    const sumContour = {};
    frame.drawPolylines([contourY], false, blue, 3);
    console.log('contourY: ', contourY.length);
    contourY.forEach(pt => {
      frame.drawCircle(pt, 5, blue, 10, cv.FILLED);
      const frameCount = pt.x + subtract;
      if (!sumContour[frameCount]) sumContour[frameCount] = {};
      sumContour[frameCount].centerY = pt.y;
    });
    for (let i = 1; i < contourY.length; i++) {
      console.log(
        (contourY[i].y - contourY[i - 1].x) /
          (contourY[i].x - contourY[i - 1].x)
      );
    }
    frame.drawPolylines([contourX], false, red, 3);
    console.log('contourX: ', contourX.length);
    for (let i = 1; i < contourX.length; i++) {
      console.log(
        (contourX[i].y - contourX[i - 1].x) /
          (contourX[i].x - contourX[i - 1].x)
      );
    }
    contourX.forEach(pt => {
      frame.drawCircle(pt, 5, red, 10, cv.FILLED);
      const frameCount = pt.x + subtract;
      if (!sumContour[frameCount]) sumContour[frameCount] = {};
      sumContour[frameCount].centerX = pt.y;
    });
    frame.drawPolylines([contourW], false, yellow, 3);
    console.log('contourW: ', contourW);
    console.log('contourW: ', contourW.length);
    for (let i = 1; i < contourW.length; i++) {
      console.log(
        (contourW[i].y - contourW[i - 1].x) /
          (contourW[i].x - contourW[i - 1].x)
      );
    }
    contourW.forEach(pt => {
      frame.drawCircle(pt, 5, yellow, 10, cv.FILLED);
      const frameCount = pt.x + subtract;
      if (!sumContour[frameCount]) sumContour[frameCount] = {};
      sumContour[frameCount].width = pt.y;
    });
    frame.drawPolylines([contourH], false, green, 3);
    console.log('contourH: ', contourH.length);
    for (let i = 1; i < contourH.length; i++) {
      console.log(
        (contourH[i].y - contourH[i - 1].x) /
          (contourH[i].x - contourH[i - 1].x)
      );
    }
    contourH.forEach(pt => {
      frame.drawCircle(pt, 5, green, 10, cv.FILLED);
      const frameCount = pt.x + subtract;
      if (!sumContour[frameCount]) sumContour[frameCount] = {};
      sumContour[frameCount].height = pt.y;
    });

    console.log(_.cloneDeep(sumContour));
    let iterFrames = Object.keys(sumContour);
    const keyProps = Object.keys(sumContour[iterFrames[0]]);
    const prevKeyframe = {};
    keyProps.forEach(key => {
      prevKeyframe[key] = 0;
    });
    console.log('prevKeyframe: ', { prevKeyframe, keyProps, iterFrames });

    const findX0 = (x1, y1, x2, y2) =>
      Math.ceil(x2 - ((x2 - x1) * y2) / (y2 - y1));
    const findXN = (x1, y1, x2, y2) =>
      Math.floor(x1 - ((x2 - x1) * y1) / (y2 - y1));
    const interpolate = (_x1, y1, _x2, y2, _xN) => {
      const x1 = parseFloat(_x1);
      const x2 = parseFloat(_x2);
      const xN = parseFloat(_xN);
      console.log('interpolate: ', {
        _x1,
        _x2,
        _xN,
        x1,
        y1,
        x2,
        y2,
        xN,
        yN: y1 + ((y2 - y1) * (xN - x1)) / (x2 - x1)
      });
      return y1 + ((y2 - y1) * (xN - x1)) / (x2 - x1);
    };
    const interpolBetween = (i, j, key) => {
      console.log('interpolBetween: ', { i, j, key });

      for (let p = i + 1; p < j; p++) {
        sumContour[iterFrames[p]][key] = interpolate(
          iterFrames[i],
          sumContour[iterFrames[i]][key],
          iterFrames[j],
          sumContour[iterFrames[j]][key],
          iterFrames[p]
        );
        console.log('iterFrames', {
          i,
          j,
          p,
          key,
          ii: iterFrames[i],
          ij: iterFrames[j],
          ip: iterFrames[p],
          si: sumContour[iterFrames[i]],
          sj: sumContour[iterFrames[j]]
        });
      }
    };
    for (let i = 1; i < iterFrames.length; i++) {
      for (let j = 0; j < keyProps.length; j++) {
        const key = keyProps[j];
        if (sumContour[iterFrames[i]][key] !== undefined) {
          console.log('sumContour[iterFrames[i]][key]: ', {
            i,
            j,
            key,
            frame: iterFrames[i],
            keyprop: keyProps[j],
            sum: sumContour[iterFrames[i]][key],
            sumContour
          });
          interpolBetween(prevKeyframe[key], i, key);
          prevKeyframe[key] = i;
          console.log('prevKeyframe: ', _.cloneDeep(prevKeyframe));
        }
      }
    }
    console.log(_.cloneDeep(sumContour));
    const interpolateWidth = (x1, x2, dir) => {
      let xN;
      if (dir < 0) {
        xN = findX0(x1, sumContour[x1].height, x2, sumContour[x2].height);
        console.log('dir<0', {
          x1,
          sx1: sumContour[x1].height,
          x2,
          sx2: sumContour[x2].height
        });
      } else {
        xN = findXN(x1, sumContour[x1].height, x2, sumContour[x2].height);

        console.log('dir>0', {
          x1,
          sx1: sumContour[x1].height,
          x2,
          sx2: sumContour[x2].height,
          xN
        });
      }
      const val = {};
      Object.keys(sumContour[x1]).forEach(key => {
        const y1 = sumContour[x1][key];
        const y2 = sumContour[x2][key];
        val[key] = interpolate(x1, y1, x2, y2, xN);
      });
      return [xN, val];
    };
    const [key2, val] = interpolateWidth(iterFrames[0], iterFrames[1], -1);
    sumContour[key2] = val;
    const [key3, val2] = interpolateWidth(
      iterFrames[iterFrames.length - 2],
      iterFrames[iterFrames.length - 1],
      1
    );
    sumContour[key3] = val2;
    console.log(_.cloneDeep(sumContour));
    delete sumContour[iterFrames[0]];
    delete sumContour[iterFrames[iterFrames.length - 1]];
    console.log(sumContour, iterFrames);
    iterFrames = Object.keys(sumContour);
    const embrace = arr => {
      return `{${arr.join()}}`;
    };
    let maxHeight = 0;
    iterFrames.forEach(key => {
      Object.keys(sumContour[key]).forEach(key2 => {
        if (key2 === 'height' && maxHeight < sumContour[key][key2])
          maxHeight = sumContour[key][key2];
      });
    });

    const round3Dig = num => Math.round(num * 1000) / 1000;
    const arr = [];
    for (let i = 0; i < iterFrames.length; i++) {
      const join = [
        `t=${round3Dig((iterFrames[i] * 1000) / FPS)}`,
        `x=${round3Dig(sumContour[iterFrames[i]].centerX)}`,
        `y=${round3Dig(sumContour[iterFrames[i]].centerY)}`,
        `w=${round3Dig(sumContour[iterFrames[i]].width)}`,
        `h=${round3Dig(sumContour[iterFrames[i]].height)}`,
        `p=${round3Dig((sumContour[iterFrames[i]].height * 100) / maxHeight)}`
      ];
      arr.push(embrace(join));
    }
    const output = `_G.table.insert(db,${embrace(arr)})`;
    console.log('output: ', output);
    // delete sumContour[iterFrames[0]];

    dispatch(putFrame(frame));
    frame.release();
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
