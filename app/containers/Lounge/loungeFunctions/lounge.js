import {
  color,
  loungeBackgroundColorThreshold,
  maxMinDist
} from '../constants';

import Queue from '../../../classes/Queue';
import XLSX from 'xlsx';
import _ from 'lodash';
import { actionTypes } from '../actions';
import cv from 'opencv4nodejs';
// import { dotMat } from '../utils/utilityCv';
// import fitCurve from './fitCurve';
import fs from 'fs';
// export function importing() {
//   return async (dispatch, getState) => {
//     const {
//       vCap,
//       // vCapPackage: { putFrame, FPS },
//       importedFile,
//       valueSlider
//     } = getState().Lounge;
//     let data = importedFile;
//     if (!data) {
//       const { filePaths, canceled } = await dialog.showOpenDialog({
//         properties: ['openFile'],
//         filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx', 'csv'] }]
//       });
//       if (canceled) return;
//       const workbook = XLSX.readFile(filePaths[0]);
//       const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
//       data = XLSX.utils.sheet_to_json(firstWorksheet);
//       dispatch({
//         type: actionTypes.IMPORTING,
//         payload: data
//       });
//     }
//     const subtract = 0;
//     const multiply = 1;
//     const div = 1;
//     const contourX = data.map(item => [
//       (item.frame - subtract) * multiply,
//       item.centerX / div
//     ]);
//     console.log('contourX: ', contourX);
//     const temp1 = fitCurve(contourX, 10, res => console.log('res', res));
//     console.log('temp1: ', temp1);
//   };
// }
import path from 'path';
import { remote } from 'electron';

const { dialog } = remote;

/* eslint-disable no-console */

export async function findBorder(frame, initX, initY, putFrame) {
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

function getH(contour) {
  const { w: next, x: prev, y: child, z: parent } = contour.hierarchy;
  return { next, prev, child, parent };
}

function logChild(mat, contours, arr) {
  const colorKey = Object.keys(color);
  arr.forEach((selected, index) => {
    const selectedColor = color[colorKey[index % colorKey.length]];
    let { child: cur } = getH(selected);
    let c = 1;
    mat.drawContours([selected.getPoints()], -1, selectedColor, 2);
    const sumPoints = [];
    do {
      const { next } = getH(contours[cur]);
      console.log(c++, next, contours[cur].area);
      const points = contours[cur].getPoints();
      sumPoints.push(points);
      cur = next;
    } while (cur > 0);
    mat.drawContours(sumPoints, -1, selectedColor, 1);
    const rect = new cv.Contour(sumPoints.flat()).boundingRect();
    mat.drawRectangle(rect, selectedColor, 3);
  });
}

function getChildrenRect(contours, selected) {
  let { child: cur } = getH(selected);
  const sumPoints = [];
  do {
    const { next } = getH(contours[cur]);
    const points = contours[cur].getPoints();
    sumPoints.push(points);
    cur = next;
  } while (cur > 0);
  return new cv.Contour(sumPoints.flat()).boundingRect();
}

export function findTextBubble2(frame) {
  const contours = frame
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(200, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  console.log('contours: ', contours);
  const outObj = [];
  contours.forEach(item => {
    if (item.area > 5000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.04 * peri, true);
      if (approx.length === 4) {
        const approxContour = new cv.Contour(approx);
        if (isFinalContour(approxContour)) {
          const maskMat = new cv.Mat(
            frame.rows,
            frame.cols,
            cv.CV_8UC1,
            color.black
          );
          maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
          const childrenRect = getChildrenRect(contours, item);
          maskMat.drawRectangle(childrenRect, color.black, cv.FILLED);
          const intermetFrame = new cv.Mat(
            frame.rows,
            frame.cols,
            cv.CV_8UC3,
            color.black
          );
          frame.copyTo(intermetFrame, maskMat);
          const { w, x, y } = frame.mean(maskMat);
          if (Math.min(w, x, y) > loungeBackgroundColorThreshold) {
            outObj.push(item);
          }
        }
      }
    }
  });
  console.log('outObj: ', outObj);
  return outObj;
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

export function handleInputBlur(e, value) {
  return (dispatch, getState) => {
    return {
      type: actionTypes.HANDLE_INPUT_BLUR,
      payload: value
    };
  };
}

function rectToCenterPt(rect) {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

function findDist(pt1, pt2) {
  return (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y);
}

function nonBlockingLoop({
  callback,
  finished,
  chunksize,
  begin,
  endend,
  vCap,
  checkLoopValid,
  dispatch
}) {
  let i = begin;
  (function chunk() {
    const end = Math.min(i + chunksize, endend);
    const before = i;
    for (; i < end; i++) {
      if (!checkLoopValid()) break;
      callback(i);
    }
    dispatch(addProgress(i - before));
    vCap.show(i);
    if (i >= endend) finished(true);
    else if (!checkLoopValid()) finished(false);
    else setTimeout(chunk, 0);
  })();
}

export function exporting() {
  return async (dispatch, getState) => {
    const {
      // canvasRef,
      vCap
      // vCapPackage: { putFrame }
    } = getState().Lounge;
    const [beginTime, endTime] = [1234, 1581];
    // const [beginTime, endTime] = [1819, 2005];
    let maxArea = 0;
    let maxItemIndex;
    let maxArrayIndex;
    dispatch(startProgress(endTime - beginTime + 1));
    // setFrameByType(vCap, beginTime, 'frame');
    const outArr = [];
    nonBlockingLoop({
      chunksize: 50,
      begin: beginTime,
      endend: endTime,
      dispatch,
      vCap,
      checkLoopValid: () => getState().Lounge.progressFull,
      callback: i => {
        const obj = { frame: i };
        const frame = vCap.getRawRaw(i);

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
      },
      finished: async resolved => {
        if (!resolved) return;
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
        console.log(
          'maxArrayIndex, maxItemIndex: ',
          maxArrayIndex,
          maxItemIndex
        );
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
        const { canceled, filePath } = await dialog.showSaveDialog({
          filters: [{ name: 'Excel files', extensions: ['xlsx'] }]
        });
        if (canceled) return;
        const worksheet = XLSX.utils.json_to_sheet(trueOutput, { header });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'BanG_Dream');
        XLSX.writeFile(workbook, filePath);
        dispatch(stopProgress());
      }
    });
  };
}

export function importing() {
  return async (dispatch, getState) => {
    let defaultFileName = '';
    const {
      vCap,
      // vCapPackage: { putFrame, FPS },
      importedFile,
      valueSlider: { approx: approxDP }
    } = getState().Lounge;
    let data = importedFile;
    if (!data) {
      const { filePaths, canceled } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Excel Files', extensions: ['xls', 'xlsx', 'csv'] }]
      });
      if (canceled) return;
      defaultFileName = path.parse(filePaths[0]).name;
      const workbook = XLSX.readFile(filePaths[0]);
      const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(firstWorksheet);
      dispatch({
        type: actionTypes.IMPORTING,
        payload: data
      });
    }

    const approxContour = _item => {
      console.log('1');
      const item = new cv.Contour(_item);
      console.log('2');
      const peri = item.arcLength(true);
      console.log('3');
      const approx = item.approxPolyDP(0.0001 * approxDP * peri, true);
      console.log('approx: ', approx);
      console.log('4');
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
    console.log('contourY: ', contourY);
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
    console.log('contourX: ', contourX);
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
    console.log('contourW: ', contourW);
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
    console.log('contourH: ', contourH);
    // contourX.sort((a, b) => a.x - b.x);
    // contourY.sort((a, b) => a.x - b.x);
    // contourW.sort((a, b) => a.x - b.x);
    // contourH.sort((a, b) => a.x - b.x);
    // rewindOneFrame(vCap);
    const frame = vCap.getMat();
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
    // delete sumContour[iterFrames[0]];
    // delete sumContour[iterFrames[iterFrames.length - 1]];
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
        `t=${round3Dig((iterFrames[i] * 1000) / vCap.FPS)}`,
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
    vCap.showMatInCanvas(frame);
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultFileName,
      filters: [{ name: 'Text file', extensions: ['txt'] }]
    });
    if (canceled) return;
    fs.writeFile(filePath, output, err => {
      if (!err) console.log('finished writing file');
    });
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

function stopProgress() {
  return {
    type: actionTypes.STOP_PROGRESS
  };
}
