import {
  black,
  cols,
  nameLabelCrop,
  nameLabelThreshold,
  rows,
  threshPercentSame,
  white
} from '../constants';

import cv from 'opencv4nodejs';

const { innerX, outerX, innerY, outerY } = nameLabelCrop;
const maskRect = new cv.Mat(rows, cols, cv.CV_8UC3);
maskRect.drawRectangle(
  new cv.Point2(outerX[0], outerY[0]),
  new cv.Point2(outerX[1], outerY[1]),
  white,
  -1
);
maskRect.drawRectangle(
  new cv.Point2(innerX[0], innerY[0]),
  new cv.Point2(innerX[1], innerY[1]),
  black,
  -1
);

// const rectNameLabel = new cv.Rect(
//   innerX[0],
//   innerY[0],
//   innerX[1] - innerX[0],
//   innerY[1] - innerY[0]
// );

const CaptureNameLabel = cv.imread('CaptureNameLabel.png');
const countNameLabel = CaptureNameLabel.cvtColor(
  cv.COLOR_BGR2GRAY
).countNonZero();

export default function nameLabelGenerator(mat) {
  const { val, sat, hue } = nameLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR)
    .and(maskRect)
    .bitwiseXor(CaptureNameLabel);
  if (
    (masked.cvtColor(cv.COLOR_BGR2GRAY).countNonZero() / countNameLabel) * 100 <
    threshPercentSame
  ) {
    // const nameLabel = CaptureNameLabel.getRegion(rectNameLabel);
  }
  return mat;
}
