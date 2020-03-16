import {
  nameLabelThreshold,
  qualityRatio,
  starCrop,
  starROI,
  threshPercentDiff,
  threshStarMatching
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const starIM = cv.imread(
  PATHS.resourcePath(`CaptureStarCrop_${qualityRatio}.png`)
);

const { val, sat, hue } = nameLabelThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

const starTemplate = starIM.cvtColor(cv.COLOR_BGR2GRAY);

const threshStar = starIM
  .cvtColor(cv.COLOR_BGR2HSV)
  .inRange(lowerColorBounds, upperColorBounds);

const countStar = threshStar.countNonZero();

const { rectX: roiX, rectY: roiY } = starROI;
const starRegion = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);
const { rectX, rectY } = starCrop;
const starRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function starMatching(mat) {
  const threshMat = mat
    .getRegion(starRect)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseXor(threshStar);
  const percentDiff = (threshMat.countNonZero() / countStar) * 100;
  if (percentDiff < threshPercentDiff) {
    return {
      x: 0,
      y: 0
    };
  }
  const { maxLoc, maxVal } = mat
    .getRegion(starRegion)
    .cvtColor(cv.COLOR_BGR2GRAY)
    .matchTemplate(starTemplate, cv.TM_CCOEFF_NORMED)
    // .normalize(0, 1, cv.NORM_MINMAX, -1)
    .minMaxLoc();
  if (maxVal > threshStarMatching) {
    return {
      x: maxLoc.x + roiX[0] - rectX[0],
      y: maxLoc.y + roiY[0] - rectY[0]
    };
  }
  return null;
}
