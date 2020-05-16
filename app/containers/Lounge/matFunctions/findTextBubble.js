import { color, loungeBackgroundColorThreshold } from '../constants';

import cv from 'opencv4nodejs';

function getH(contour) {
  const { w: next, x: prev, y: child, z: parent } = contour.hierarchy;
  return { next, prev, child, parent };
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

function logChild(mat, contours, arr) {
  // const colorKey = Object.keys(color);
  arr.forEach(selected => {
    // const selectedColor = color[colorKey[index % colorKey.length]];
    let { child: cur } = getH(selected);
    // mat.drawContours([selected.getPoints()], -1, selectedColor, 2);
    const sumPoints = [];
    do {
      const { next } = getH(contours[cur]);
      const points = contours[cur].getPoints();
      sumPoints.push(points);
      cur = next;
    } while (cur > 0);
    // mat.drawContours(sumPoints, -1, selectedColor, 1);
    // const rect = new cv.Contour(sumPoints.flat()).boundingRect();
    // mat.drawRectangle(rect, selectedColor, 3);
  });
}

export default function findTextBubble(mat) {
  const outputFrame = mat.copy();
  // const red = new cv.Vec(0, 0, 255);
  // const green = new cv.Vec(0, 255, 0);
  // const blue = new cv.Vec(255, 0, 0);
  const contours = mat
    .cvtColor(cv.COLOR_RGB2GRAY)
    .gaussianBlur(new cv.Size(3, 3), 0)
    .threshold(200, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
  // eslint-disable-next-line no-console
  console.log('contours: ', contours);
  const outObj = [];
  contours.forEach(item => {
    if (item.area > 5000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.04 * peri, true);
      if (approx.length === 4) {
        const approxContour = new cv.Contour(approx);
        if (isFinalContour(approxContour)) {
          const roi = item.boundingRect();
          const maskMat = new cv.Mat(
            mat.rows,
            mat.cols,
            cv.CV_8UC1,
            color.black
          );
          maskMat.drawContours([item.getPoints()], -1, color.white, cv.FILLED);
          const childrenRect = getChildrenRect(contours, item);
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
          }
          // dotMat(outputFrame, maxLoc, color.red, 2, 20);
          // dotMat(outputFrame, minLoc, color.blue, 2, 20);
          // if (minVal > 180) {
          //   outObj.push(item);
          // }
          // const finalRect = approxContour.boundingRect();
          // outputFrame.drawContours([approx], -1, color.blue, 1);
          // outputFrame.drawContours([item.getPoints()], -1, color.green, 1);
          // outputFrame.drawRectangle(item.boundingRect(), color.green, 1);
          // outputFrame.drawRectangle(finalRect, color.yellow, 3);
          // outputFrame.drawCircle(
          //   new cv.Point(
          //     finalRect.x + finalRect.width / 2,
          //     finalRect.y + finalRect.height / 2
          //   ),
          //   5,
          //   color.red,
          //   10,
          //   cv.FILLED
          // );
        }
      }
    }
  });
  logChild(outputFrame, contours, outObj);
  return outputFrame;
}
