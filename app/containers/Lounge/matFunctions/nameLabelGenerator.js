import {
  blue,
  nameLabelCrop,
  nameLabelThreshold,
  red,
  subtitleCrop,
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
const { rectX, rectY } = subtitleCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
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
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (percentDiff < threshPercentDiff) {
    const actor = threshMat.getRegion(rectNameLabel);
    const subtitle = subtitleFinder(mat);
    // eslint-disable-next-line no-console
    console.log({ subtitle: subtitle.countNonZero(), actor });
    mat.drawRectangle(rectOuterNameLabel, blue, 2);
    mat.drawRectangle(subtitleRect, red, 2);
  }
  return mat;
}
