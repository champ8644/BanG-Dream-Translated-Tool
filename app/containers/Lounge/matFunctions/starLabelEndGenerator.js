import {
  color,
  qualityRatio,
  rx,
  starLabelEndColorThreshold,
  starLabelEndCrop,
  starLabelEndROI,
  starLabelEndThreshold,
  thickness
} from '../constants';
import { mat2Rect, paintMat, writeMat } from '../utils/utilityCv';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';
import { formatNumber } from '../constants/function';

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
const rectStarLabelEnd = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const { roiX, roiY } = starLabelEndROI;
const roiStarLabelEnd = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);

export default function starLabelEndTemplater(mat) {
  const cannyMat = mat
    .getRegion(roiStarLabelEnd)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot()
    .canny(0, 255, 7);
  const getMatched = cannyMat.matchTemplate(
    CannyStarLabelEndCrop,
    cv.TM_CCORR_NORMED
  );
  const normGetMatched = getMatched.convertTo(cv.CV_8UC1, 255, 0);
  const matchProps = getMatched.minMaxLoc();
  const { maxLoc, maxVal } = matchProps;
  const normRect = mat2Rect(
    rectStarLabelEnd.x,
    rectStarLabelEnd.y,
    normGetMatched
  );
  paintMat(mat, cannyMat, roiStarLabelEnd, color.black);
  paintMat(mat, normGetMatched, normRect, color.blue, -roiStarLabelEnd.height);
  const diff = {
    x: maxLoc.x + roiX[0] - rectX[0],
    y: maxLoc.y + roiY[0] - rectY[0]
  };
  const matchRect = new cv.Rect(
    rectStarLabelEnd.x + diff.x,
    rectStarLabelEnd.y + diff.y,
    rectStarLabelEnd.width,
    rectStarLabelEnd.height
  );
  if (maxVal > starLabelEndThreshold) {
    mat.drawRectangle(matchRect, color.yellow, thickness);
    writeMat(mat, `{${diff.x},${diff.y}}`, [685, 1220], color.purple);
  }
  writeMat(mat, `[${formatNumber(maxVal)}]`, [994, 1220], color.blue);
  return mat;
}
