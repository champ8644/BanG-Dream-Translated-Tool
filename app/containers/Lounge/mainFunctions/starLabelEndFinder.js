import {
  qualityRatio,
  rx,
  starLabelEndColorThreshold,
  starLabelEndCrop,
  starLabelEndROI,
  starLabelEndThreshold
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const { val, sat, hue } = starLabelEndColorThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

let CannyStarLabelEndCrop;
try {
  CannyStarLabelEndCrop = cv
    .imread(PATHS.resourcePath(`CannyStarLabelEndCrop_${qualityRatio}.png`))
    .cvtColor(cv.COLOR_BGR2GRAY);
} catch {
  CannyStarLabelEndCrop = cv
    .imread(PATHS.resourcePath(`CannyStarLabelEndCrop.png`))
    .rescale(rx)
    .cvtColor(cv.COLOR_BGR2GRAY);
}

const { rectX, rectY } = starLabelEndCrop;
const { roiX, roiY } = starLabelEndROI;
const roiStarLabelEnd = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);

export default function starLabelEndTemplater(mat) {
  const { maxLoc, maxVal } = mat
    .getRegion(roiStarLabelEnd)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot()
    .canny(0, 255, 7)
    .matchTemplate(CannyStarLabelEndCrop, cv.TM_CCORR_NORMED)
    .minMaxLoc();
  return {
    status: maxVal > starLabelEndThreshold,
    diff: {
      x: maxLoc.x + roiX[0] - rectX[0],
      y: maxLoc.y + roiY[0] - rectY[0]
    }
  };
}
