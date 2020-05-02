import {
  nameLabelCrop,
  nameLabelStarROI,
  nameLabelThreshold,
  threshStarMatching
} from '../constants';

import cv from 'opencv4nodejs';

const { innerX, innerY } = nameLabelCrop;
const { val, sat, hue } = nameLabelThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

const { rectX: roiX, rectY: roiY } = nameLabelStarROI;
const nameLabelStarRegion = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);

export default function starMatching(mat, currentActor) {
  const { actor } = currentActor;
  const { maxLoc, maxVal } = mat
    .getRegion(nameLabelStarRegion)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot()
    .canny(0, 255, 7)
    .matchTemplate(actor.canny(0, 255, 7), cv.TM_CCORR_NORMED, actor)
    .minMaxLoc();
  if (maxVal > threshStarMatching) {
    return {
      x: maxLoc.x + roiX[0] - innerX[0],
      y: maxLoc.y + roiY[0] - innerY[0]
    };
  }
  return null;
}

// const threshMat = mat
//   .getRegion(rectNameLabelStarCrop)
//   .cvtColor(cv.COLOR_BGR2HSV)
//   .inRange(lowerColorBounds, upperColorBounds)
//   .bitwiseXor(actorStar);
// const percentDiff =
//   (threshMat.countNonZero() / threshMat.rows / threshMat.cols) * 100;
// if (percentDiff < threshPercentDiff) {
//   return {
//     x: 0,
//     y: 0
//   };
// }
