import {
  titleLabelCrop,
  placeLabelThreshold,
  threshTitlePercentDiff,
  titleHeader,
  color
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
  const { red, green, blue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const threshMat = mat
    .getRegion(rectTitleLabel)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CaptureTitleLabel).bitwiseXor(CaptureTitleLabel);
  const percentDiff = (masked.countNonZero() / countTitleLabel) * 100;
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
