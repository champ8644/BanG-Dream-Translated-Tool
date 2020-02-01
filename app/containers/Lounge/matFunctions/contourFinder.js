import cv from 'opencv4nodejs';
import { nameLabelThreshold } from '../constants';
/* eslint-disable no-bitwise */

export default function contourFinder(
  mat
  // , vCap
) {
  // const contours = mat
  //   .cvtColor(cv.COLOR_RGB2GRAY)
  //   .gaussianBlur(new cv.Size(3, 3), 0)
  //   .threshold(240, 255, cv.THRESH_BINARY);
  const { red, green, blue } = nameLabelThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const mask = mat.inRange(lowerColorBounds, upperColorBounds);
  const maskRgb = mask.cvtColor(cv.COLOR_GRAY2BGR);
  // .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  return maskRgb;
}
