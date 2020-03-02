import {
  color,
  nameLabelThreshold,
  qualityRatio,
  starCrop,
  starROI,
  threshPercentDiff
} from '../constants';

import cv from 'opencv4nodejs';

const starIM = cv.imread(`CaptureStarCrop_${qualityRatio}.png`);

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

export default function starTemplater(mat) {
  const threshMat = mat
    .getRegion(starRect)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseXor(threshStar);
  const percentDiff = (threshMat.countNonZero() / countStar) * 100;
  if (percentDiff < threshPercentDiff) {
    mat.drawRectangle(starRect, color.black, 2);
    return mat;
  }
  const arr = [
    cv.TM_SQDIFF,
    cv.TM_SQDIFF_NORMED,
    cv.TM_CCORR,
    cv.TM_CCORR_NORMED,
    cv.TM_CCOEFF,
    cv.TM_CCOEFF_NORMED
  ];
  const arrColor = [
    color.red,
    color.blue,
    color.green,
    color.yellow,
    color.cyan,
    color.purple
  ];
  const arrValid = [0, 0, 0, 0, 0, 1];
  for (let i = 0; i < 6; i++) {
    if (arrValid[i]) {
      const { minLoc, maxLoc } = mat
        .getRegion(starRegion)
        .cvtColor(cv.COLOR_BGR2GRAY)
        .matchTemplate(starTemplate, arr[i])
        // .normalize(0, 1, cv.NORM_MINMAX, -1)
        .minMaxLoc();
      const matchLoc =
        arr[i] === cv.TM_SQDIFF || arr[i] === cv.TM_SQDIFF_NORMED
          ? minLoc
          : maxLoc;
      // matchLoc.x += roiX[0];
      // matchLoc.y += roiY[0];
      mat.drawRectangle(
        new cv.Point2(matchLoc.x + roiX[0], matchLoc.y + roiY[0]),
        new cv.Point2(
          matchLoc.x + roiX[0] + starTemplate.cols,
          matchLoc.y + roiY[0] + starTemplate.rows
        ),
        arrColor[i],
        2
      );
    }
  }
  return mat;
}
