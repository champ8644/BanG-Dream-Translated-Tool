import {
  color,
  placeLabelThreshold,
  threshTitlePercentDiff,
  titleHeader,
  titleLabelCrop
} from '../constants';

import cv from 'opencv4nodejs';
import titleLineWidthFinder from './titleLineWidthFinder';

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
export default function titleLabelGenerator(mat) {
  const { val, sat, hue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const threshMat = mat
    .getRegion(rectTitleLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CaptureTitleLabel).bitwiseXor(CaptureTitleLabel);
  const percentDiff = (masked.countNonZero() / countTitleLabel) * 100;
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (percentDiff < threshTitlePercentDiff) {
    const titleWidth = titleLineWidthFinder(mat);
    const drawRect = new cv.Rect(
      titleHeader.x,
      titleHeader.y,
      titleWidth,
      titleHeader.height
    );
    mat.drawRectangle(drawRect, color.blue, 2);
  }
  return mat;
}
