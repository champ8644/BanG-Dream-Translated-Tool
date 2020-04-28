import { blue, placeLabelCrop, red } from '../constants';

import cv from 'opencv4nodejs';
import makePlaceLabel from '../mainFunctions/makePlaceLabel';
import { paintMat } from '../utils/utilityCv';

const { outerX, outerY, innerX, innerY } = placeLabelCrop;
const rectOuterPlaceLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const rectPlaceLabel = new cv.Rect(
  innerX[0],
  innerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
);
export default function placeLabelGenerator(mat, vCap) {
  const { percentDiff, status, placeName, threshMat } = makePlaceLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    paintMat(mat, threshMat, rectOuterPlaceLabel, blue);
    paintMat(mat, placeName, rectPlaceLabel, red);
    // paintMat(mat, roiMat, rectOuterPlaceLabel, blue);
    // mat.drawRectangle(rectOuterPlaceLabel, blue, thickness);
    // eslint-disable-next-line no-console
    console.log({
      placeName: placeName.countNonZero(),
      frame: vCap.getFrame()
    });
  }
  return mat;
}
