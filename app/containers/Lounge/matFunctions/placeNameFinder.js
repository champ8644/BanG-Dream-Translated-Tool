import { placeCenterThreshold, placeLabelCrop } from '../constants';

import cv from 'opencv4nodejs';

const { innerX, innerY } = placeLabelCrop;
const rectPlaceLabel = new cv.Rect(
  innerX[0],
  innerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
);

export default function placeNameFinder(mat) {
  const { gray } = placeCenterThreshold;
  const lowerColorBounds = new cv.Vec(gray[0], gray[0], gray[0]);
  const upperColorBounds = new cv.Vec(gray[1], gray[1], gray[1]);
  return mat
    .getRegion(rectPlaceLabel)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot();
}
