import {
  blue,
  qualityRatio,
  starLabelEndCrop,
  starLabelEndThreshold
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';
import { paintMat } from '../utils/utilityCv';

// import { thresholdOtsu } from '../utils/thresholdCv';

const { rectX, rectY } = starLabelEndCrop;
// const maskRect = new cv.Mat(
//   rectY[1] - rectY[0],
//   rectX[1] - rectX[0],
//   cv.CV_8UC3,
//   [255, 255, 255]
// );
// maskRect.drawRectangle(
//   new cv.Point2(rectX[0] - rectX[0], rectY[0] - rectY[0]),
//   new cv.Point2(rectX[1] - rectX[0], rectY[1] - rectY[0]),
//   black,
//   -1
// );
const rectStarLabelEnd = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function starLabelEndTemplater(mat) {
  const { val, sat, hue } = starLabelEndThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const mask = mat
    .getRegion(rectStarLabelEnd)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const canny = mask.bitwiseNot().canny(0, 255, 7);
  //   .and(maskRect);
  cv.imwrite(
    PATHS.resourcePath(`MaskStarLabelEndCrop_${qualityRatio}_Temp.png`),
    mask
  );
  cv.imwrite(
    PATHS.resourcePath(`CannyStarLabelEndCrop_${qualityRatio}_Temp.png`),
    canny
  );
  paintMat(mat, mask, rectStarLabelEnd, blue);
  return mat;
}
