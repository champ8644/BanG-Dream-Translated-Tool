import cv from 'opencv4nodejs';

/* eslint-disable no-bitwise */

export default function contourFinder(mat) {
  // const contours = mat
  //   .cvtColor(cv.COLOR_RGB2GRAY)
  //   .gaussianBlur(new cv.Size(3, 3), 0)
  //   .threshold(240, 255, cv.THRESH_BINARY);
  const lowerColorBounds = new cv.Vec(0, 0, 100);
  const upperColorBounds = new cv.Vec(80, 80, 225);
  const mask = mat.inRange(lowerColorBounds, upperColorBounds);
  const maskRgb = mask.cvtColor(cv.COLOR_GRAY2BGR);
  // .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  return maskRgb;
}
