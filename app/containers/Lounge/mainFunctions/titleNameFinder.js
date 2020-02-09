import { placeCenterThreshold, titleHeader } from '../constants';

import cv from 'opencv4nodejs';

export default function titleNameFinder(mat, width) {
  const rectTitleLabel = new cv.Rect(
    titleHeader.x,
    titleHeader.y,
    width,
    titleHeader.height
  );
  const { gray } = placeCenterThreshold;
  const lowerColorBounds = new cv.Vec(gray[0], gray[0], gray[0]);
  const upperColorBounds = new cv.Vec(gray[1], gray[1], gray[1]);
  return mat
    .getRegion(rectTitleLabel)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot();
}
