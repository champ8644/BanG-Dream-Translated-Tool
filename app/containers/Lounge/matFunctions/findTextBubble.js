import {
  color,
  limitLoungeMoving,
  loungeBackgroundColorThreshold
} from '../constants';

import cv from 'opencv4nodejs';
import { writeMat } from '../utils/utilityCv';

class StatusRectClass {
  setFrame(frame) {
    this.frame = frame;
    this.vertIndex = 0;
    this.lowVertIndex = 0;
    this.midVertIndex = 0;
  }

  writeBelow(rect) {
    const { x, y, width, height, index } = rect;
    const outObj = { x, y, width, height, index };
    writeMat(
      this.frame,
      JSON.stringify(outObj),
      new cv.Point2(100, 1340 - 100 * this.lowVertIndex),
      'black'
    );
    this.lowVertIndex++;
  }

  writeMiddle(rect) {
    const { x1, y1, x2, y2, index } = rect;
    const outObj = { x1, y1, x2, y2, index };
    writeMat(
      this.frame,
      JSON.stringify(outObj),
      new cv.Point2(100, 640 + 100 * this.midVertIndex),
      'black'
    );
    this.midVertIndex++;
  }

  write(rect) {
    const { x, y, width, height, index } = rect;
    const outObj = { x, y, width, height, index };
    writeMat(
      this.frame,
      JSON.stringify(outObj),
      new cv.Point2(100, 100 + 100 * this.vertIndex),
      'black'
    );
    this.vertIndex++;
  }
}
const statusRect = new StatusRectClass();

function getH(contour) {
  const { w: next, x: prev, y: child, z: parent } = contour.hierarchy;
  return { next, prev, child, parent };
}

function isFinalContour(contour, roi) {
  // if (roi.width < 130) return false;
  // if (roi.height < 130) return false;
  if (roi.width / roi.height < 2) return false;
  const rect = contour.boundingRect();
  if (rect.width <= rect.height) return false;
  const percent = (contour.area / rect.width / rect.height) * 100;
  if (percent < 80) return false;
  return true;
}

function getChildrenRect(contours, selected) {
  let { child: cur } = getH(selected);
  if (cur < 0) return null;
  const sumPoints = [];
  while (cur > 0) {
    const { next } = getH(contours[cur]);
    const points = contours[cur].getPoints();
    sumPoints.push(points);
    cur = next;
  }
  return new cv.Contour(sumPoints.flat()).boundingRect();
}

function logChild(mat, contours, arr) {
  // const colorKey = Object.keys(color);
  arr.forEach(selected => {
    // const selectedColor = color[colorKey[index % colorKey.length]];
    let { child: cur } = getH(selected);
    // mat.drawContours([selected.getPoints()], -1, color.yellow, 2);
    const sumPoints = [];
    while (cur > 0) {
      const { next } = getH(contours[cur]);
      const points = contours[cur].getPoints();
      sumPoints.push(points);
      cur = next;
    }
    mat.drawContours(sumPoints, -1, color.yellow, -1);
    // const rect = new cv.Contour(sumPoints.flat()).boundingRect();
    // mat.drawRectangle(rect, color.green, 3);
  });
}

function compareRect(rect, prevRect) {
  return {
    x1: rect.x - prevRect.x,
    y1: rect.y - prevRect.y,
    x2: rect.x + rect.width - prevRect.x - prevRect.width,
    y2: rect.y + rect.height - prevRect.y - prevRect.height
  };
}

function abs(x) {
  return x < 0 ? -x : x;
}

function calcRect(rect, prevRect) {
  const diff = compareRect(rect, prevRect);
  return ['x1', 'y1', 'x2', 'y2'].reduce(
    (state, val) => Math.max(state, abs(diff[val])),
    0
  );
}

export default function findTextBubble(mat, vCap) {
  const outputFrame = mat.copy();
  // const red = new cv.Vec(0, 0, 255);
  // const green = new cv.Vec(0, 255, 0);
  // const blue = new cv.Vec(255, 0, 0);
  statusRect.setFrame(outputFrame);
  const contours = mat
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(200, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  // eslint-disable-next-line no-console
  // console.log('contours: ', contours);
  const outObj = [];
  const res = [];
  const prevRes = vCap.getMemoize();
  contours.forEach(item => {
    const roi = item.boundingRect();
    if (item.area > 5000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.04 * peri, true);
      if (approx.length === 4) {
        const approxContour = new cv.Contour(approx);
        if (isFinalContour(approxContour, roi)) {
          const maskMat = new cv.Mat(
            mat.rows,
            mat.cols,
            cv.CV_8UC1,
            color.black
          );
          maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
          const childrenRect = getChildrenRect(contours, item);
          if (childrenRect) {
            maskMat.drawRectangle(childrenRect, color.black, cv.FILLED);
            const intermetmat = new cv.Mat(
              mat.rows,
              mat.cols,
              cv.CV_8UC3,
              color.black
            );
            mat.copyTo(intermetmat, maskMat);
            const { w, x, y } = mat.mean(maskMat);
            if (Math.min(w, x, y) > loungeBackgroundColorThreshold) {
              intermetmat.getRegion(roi).copyTo(outputFrame.getRegion(roi));
              outObj.push(item);
              res.push(childrenRect);
              statusRect.write(childrenRect);
              let mincalc = 1e10;
              let selectedRect = null;
              prevRes.forEach((rect, index) => {
                const calc = calcRect(childrenRect, rect);
                // console.log('calc: ', calc);
                if (mincalc > calc) {
                  selectedRect = index;
                  mincalc = calc;
                }
              });
              if (selectedRect !== null)
                statusRect.writeMiddle({
                  ...compareRect(childrenRect, prevRes[selectedRect]),
                  index: selectedRect
                });
            }
          }
        }
      } else {
        const maskMat = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC1, color.black);
        maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
        const childrenRect = getChildrenRect(contours, item);
        if (childrenRect) {
          maskMat.drawRectangle(childrenRect, color.black, cv.FILLED);
          const intermetmat = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3, [
            255,
            255,
            0
          ]);
          mat.copyTo(intermetmat, maskMat);
          const { w, x, y } = mat.mean(maskMat);
          if (Math.min(w, x, y) > loungeBackgroundColorThreshold) {
            // intermetmat.copyTo(outputFrame);
            intermetmat.getRegion(roi).copyTo(outputFrame.getRegion(roi));
            outObj.push(item);
            res.push(childrenRect);
            statusRect.write(childrenRect);
            let mincalc = 1e10;
            let selectedRect = null;
            prevRes.forEach((rect, index) => {
              const calc = calcRect(childrenRect, rect);
              // console.log('calc: ', calc);
              if (mincalc > calc) {
                selectedRect = index;
                mincalc = calc;
              }
            });
            if (selectedRect !== null)
              statusRect.writeMiddle({
                ...compareRect(childrenRect, prevRes[selectedRect]),
                index: selectedRect
              });
          }
        }
      }
    }
  });
  prevRes.forEach((rect, index) => statusRect.writeBelow({ ...rect, index }));
  vCap.putMemoize(res);
  logChild(outputFrame, contours, outObj);
  return outputFrame;
}

export function vCapfindTextBubble(mat) {
  const outputFrame = mat.copy();
  // const red = new cv.Vec(0, 0, 255);
  // const green = new cv.Vec(0, 255, 0);
  // const blue = new cv.Vec(255, 0, 0);
  statusRect.setFrame(outputFrame);
  const contours = mat
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(200, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  // eslint-disable-next-line no-console
  // console.log('contours: ', contours);
  const outObj = [];
  const res = [];
  contours.forEach(item => {
    if (item.area > 5000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.04 * peri, true);
      if (approx.length === 4) {
        const approxContour = new cv.Contour(approx);
        const roi = item.boundingRect();
        if (isFinalContour(approxContour, roi)) {
          const maskMat = new cv.Mat(
            mat.rows,
            mat.cols,
            cv.CV_8UC1,
            color.black
          );
          maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
          const childrenRect = getChildrenRect(contours, item);
          if (childrenRect) {
            maskMat.drawRectangle(childrenRect, color.black, cv.FILLED);
            const intermetmat = new cv.Mat(
              mat.rows,
              mat.cols,
              cv.CV_8UC3,
              color.black
            );
            mat.copyTo(intermetmat, maskMat);
            const { w, x, y } = mat.mean(maskMat);
            if (Math.min(w, x, y) > loungeBackgroundColorThreshold) {
              intermetmat.getRegion(roi).copyTo(outputFrame.getRegion(roi));
              outObj.push(item);
              res.push(childrenRect);
              statusRect.write(childrenRect);
            }
          }
        }
      }
    }
  });
  logChild(outputFrame, contours, outObj);
  return outputFrame;
}

export function testfindTextBubble(mat, prevRes, state, frame) {
  const contours = mat
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(200, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  // const outObj = [];
  const rects = [];
  // const calcs = [];
  const info = { a: 0, b: 0, c: 0 };
  contours.forEach(item => {
    if (item.area > 5000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.04 * peri, true);
      if (approx.length === 4) {
        const approxContour = new cv.Contour(approx);
        const roi = item.boundingRect();
        if (isFinalContour(approxContour, roi)) {
          const maskMat = new cv.Mat(
            mat.rows,
            mat.cols,
            cv.CV_8UC1,
            color.black
          );
          maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
          const childrenRect = getChildrenRect(contours, item);
          if (childrenRect) {
            const intermetmat = new cv.Mat(
              mat.rows,
              mat.cols,
              cv.CV_8UC3,
              color.black
            );
            mat.copyTo(intermetmat, maskMat);
            const { w, x, y } = mat.mean(maskMat);
            info.a++;
            if (Math.min(w, x, y) > loungeBackgroundColorThreshold) {
              info.b++;
              rects.push(childrenRect);
            } else {
              // eslint-disable-next-line no-console
              // console.log({ w, x, y, z: loungeBackgroundColorThreshold });
            }
          }
        }
      }
    }
  });

  // eslint-disable-next-line no-console
  // console.log(frame, info.a, info.b);

  const outputRect = [];
  const newRects = [];

  while (prevRes.length > 0 && rects.length > 0) {
    let minCalc = 1e10;
    let selP;
    let selR;
    let comp;
    prevRes.forEach((prev, idxP) => {
      rects.forEach((cur, idxR) => {
        const calc = calcRect(cur, prev);
        if (minCalc > calc) {
          minCalc = calc;
          selP = idxP;
          selR = idxR;
          comp = compareRect(cur, prev);
        }
      });
    });
    if (isNewRect(comp, minCalc)) {
      newRects.push(rects.splice(selR, 1)[0]);
    } else {
      outputRect.push({
        frame,
        ...rects.splice(selR, 1)[0],
        uid: prevRes.splice(selP, 1)[0].uid,
        ...comp,
        calc: minCalc
      });
    }
  }
  // console.log('outputRect: ', outputRect);
  outputRect.forEach(rect => {
    state[rect.uid].push(rect);
  });
  rects.forEach(rect => {
    outputRect.push({
      frame,
      ...rect,
      uid: state.length
    });
    state.push([outputRect[outputRect.length - 1]]);
  });
  newRects.forEach(rect => {
    outputRect.push({
      frame,
      ...rect,
      uid: state.length
    });
    state.push([outputRect[outputRect.length - 1]]);
  });

  return outputRect;
}

function isNewRect(rect, calc) {
  if (calc > limitLoungeMoving.c) return true;
  if (rect.x1 > limitLoungeMoving.x) return true;
  if (rect.x2 > limitLoungeMoving.x) return true;
  if (rect.y1 > limitLoungeMoving.y) return true;
  if (rect.y2 > limitLoungeMoving.y) return true;
  return false;
}
