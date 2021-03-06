import { cyan, red, thickness } from '../constants';

import cv from 'opencv4nodejs';

export default function scopeFinder(mat, vCap) {
  const {
    colorSlider: { innerX, outerX, innerY, outerY }
  } = vCap;
  mat.drawRectangle(
    new cv.Point2(outerX[0], outerY[0]),
    new cv.Point2(outerX[1], outerY[1]),
    red,
    thickness
  );
  mat.drawRectangle(
    new cv.Point2(innerX[0], innerY[0]),
    new cv.Point2(innerX[1], innerY[1]),
    cyan,
    thickness
  );
  return mat;
}
