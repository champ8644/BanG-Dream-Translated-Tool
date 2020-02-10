import {
  nameLabelCrop,
  nameLabelThreshold,
  threshPercentDiff
} from '../constants';

import cv from 'opencv4nodejs';
import subtitleFinder from './subtitleFinder';

const CaptureNameLabel = cv
  .imread('CaptureNameLabelCrop.png')
  .cvtColor(cv.COLOR_BGR2GRAY);
const countNameLabel = CaptureNameLabel.countNonZero();
const { innerX, outerX, innerY, outerY } = nameLabelCrop;
const rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const rectNameLabel = new cv.Rect(
  innerX[0] - outerX[0],
  innerY[0] - outerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
);

export default function nameLabelGenerator(mat) {
  const { val, sat, hue } = nameLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const threshMat = mat
    .getRegion(rectOuterNameLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CaptureNameLabel).bitwiseXor(CaptureNameLabel);
  const percentDiff = (masked.countNonZero() / countNameLabel) * 100;
  let actor;
  let dialog;
  if (percentDiff < threshPercentDiff) {
    actor = threshMat.getRegion(rectNameLabel);
    dialog = subtitleFinder(mat);
  }
  return {
    percentDiff,
    status: percentDiff < threshPercentDiff,
    actor,
    dialog
  };
}
