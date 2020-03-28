import { blackMaxThreshold, maxMinROI, whiteMinThreshold } from '../constants';

import cv from 'opencv4nodejs';

const { rectX, rectY } = maxMinROI;

const rectMaxMinROI = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function minMaxFinder(_mat) {
  const mat = _mat.getRegion(rectMaxMinROI).rescale(1 / 2);
  const { maxVal, minVal, maxLoc, minLoc } = mat
    .cvtColor(cv.COLOR_BGR2GRAY)
    .minMaxLoc();
  const { x, y, w } = mat.mean();
  const mean = (x + y + w) / 3;
  // eslint-disable-next-line no-console
  console.log({
    maxVal,
    minVal,
    mean,
    isBlack: maxVal < blackMaxThreshold,
    isWhite: minVal > whiteMinThreshold,
    maxLoc,
    minLoc
  });
  return mat;
}
