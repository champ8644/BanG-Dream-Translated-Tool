import { blue, placeLabelCrop } from '../constants';

import cv from 'opencv4nodejs';
import makePlaceLabel from '../mainFunctions/makePlaceLabel';

const { outerX, outerY } = placeLabelCrop;
const rectOuterPlaceLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
export default function placeLabelGenerator(mat, vCap) {
  const { percentDiff, status, placeName } = makePlaceLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    mat.drawRectangle(rectOuterPlaceLabel, blue, 1);
    // eslint-disable-next-line no-console
    console.log({
      placeName: placeName.countNonZero(),
      frame: vCap.getFrame()
    });
  }
  return mat;
}
