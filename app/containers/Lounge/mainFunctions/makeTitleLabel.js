import {
  placeLabelThreshold,
  threshTitlePercentDiff,
  titleLabelCrop
} from '../constants';

import cv from 'opencv4nodejs';
import titleLineWidthFinder from './titleLineWidthFinder';
import titleNameFinder from './titleNameFinder';

const CaptureTitleLabel = cv
  .imread('CaptureTitleLabelCrop.png')
  .cvtColor(cv.COLOR_BGR2GRAY);
const countTitleLabel = CaptureTitleLabel.countNonZero();
const { outerX, outerY } = titleLabelCrop;
const rectTitleLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
export default function titleLabelGenerator(mat, refractory) {
  const { val, sat, hue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const threshMat = mat
    .getRegion(rectTitleLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CaptureTitleLabel).bitwiseXor(CaptureTitleLabel);
  const percentDiff = (masked.countNonZero() / countTitleLabel) * 100;
  let titleWidth;
  let titleCrop;
  if (percentDiff < threshTitlePercentDiff && !refractory) {
    titleWidth = titleLineWidthFinder(mat);
    titleCrop = titleNameFinder(mat, titleWidth);
  }
  return {
    status: percentDiff < threshTitlePercentDiff,
    payload: titleCrop,
    width: titleWidth
  };
}
