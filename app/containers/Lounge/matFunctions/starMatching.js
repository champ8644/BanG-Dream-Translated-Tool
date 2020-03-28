import {
  color,
  nameLabelStarCrop,
  nameLabelStarROI,
  nameLabelThreshold,
  qualityRatio,
  rx,
  thickness,
  threshPercentDiff,
  threshStarMatching
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const { val, sat, hue } = nameLabelThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

let CaptureNameLabelStar;
try {
  CaptureNameLabelStar = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelStar_${qualityRatio}.png`))
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
} catch {
  CaptureNameLabelStar = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelStar.png`))
    .rescale(rx)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
}

const { rectX: roiX, rectY: roiY } = nameLabelStarROI;
const nameLabelStarRegion = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);
const { rectX, rectY } = nameLabelStarCrop;

const rectNameLabelStarCrop = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function starMatching(mat) {
  const threshMat = mat
    .getRegion(rectNameLabelStarCrop)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseXor(CaptureNameLabelStar);
  const percentDiff =
    (threshMat.countNonZero() / threshMat.rows / threshMat.cols) * 100;
  if (percentDiff < threshPercentDiff) {
    return {
      x: 0,
      y: 0
    };
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
  // const arrValid = [1, 1, 1, 1, 1, 1];
  const i = 3;
  // for (let i = 0; i < 6; i++) {
  // if (arrValid[i]) {
  const { minLoc, maxLoc, maxVal, minVal } = mat
    .getRegion(nameLabelStarRegion)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    // .normalize(0, 1, cv.NORM_MINMAX, -1)
    .matchTemplate(CaptureNameLabelStar, arr[i])
    .minMaxLoc();

  const matchLoc =
    arr[i] === cv.TM_SQDIFF || arr[i] === cv.TM_SQDIFF_NORMED ? minLoc : maxLoc;
  const matchVal =
    arr[i] === cv.TM_SQDIFF || arr[i] === cv.TM_SQDIFF_NORMED ? minVal : maxVal;
  // matchLoc.x += roiX[0];
  // matchLoc.y += roiY[0];
  const getStar = new cv.Rect(
    maxLoc.x + roiX[0],
    maxLoc.y + roiY[0],
    CaptureNameLabelStar.cols,
    CaptureNameLabelStar.rows
  );
  // const getRawStar = mat
  //   .getRegion(getStar)
  //   .cvtColor(cv.COLOR_BGR2HSV)
  //   .inRange(lowerColorBounds, upperColorBounds)
  //   .bitwiseXor(threshStar);
  // const percentDiff2 = (getRawStar.countNonZero() / countStar) * 100;
  // eslint-disable-next-line no-console
  console.log('diff', {
    // percent: percentDiff2,
    val: matchVal
  });
  if (matchVal > threshStarMatching) {
    // eslint-disable-next-line no-console
    console.log('diff', {
      x: matchLoc.x + roiX[0] - rectX[0],
      y: matchLoc.y + roiY[0] - rectY[0]
    });
    mat.drawRectangle(getStar, arrColor[i], thickness);
    //   }
    // }
  }
  return mat;
}
