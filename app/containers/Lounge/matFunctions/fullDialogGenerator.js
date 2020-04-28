import {
  blue,
  nameLabelCrop,
  red,
  subtitleCrop,
  thickness
} from '../constants';
import { paintMat, printHist } from './utility';

import cv from 'opencv4nodejs';
import makeNameLabel from '../mainFunctions/makeNameLabel';

const { outerX, outerY } = nameLabelCrop;
const rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const { rectX, rectY } = subtitleCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const histogramRectL = new cv.Rect(620, 50, 600, 300);
const histogramRectR = new cv.Rect(1270, 50, 600, 300);

export default function nameLabelGenerator(mat, vCap) {
  const {
    colorSlider: { thresh, blur }
  } = vCap;
  const { status, percentDiff } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) mat.drawRectangle(rectOuterNameLabel, blue, thickness);
  const dialogMat = mat.getRegion(subtitleRect).cvtColor(cv.COLOR_BGR2GRAY);
  printHist(mat, dialogMat, histogramRectL);
  const blurMat =
    blur > 0
      ? dialogMat.gaussianBlur(new cv.Size(blur * 2 + 1, blur * 2 + 1), 0)
      : dialogMat;
  const threshDialogMat = blurMat.threshold(
    thresh[0],
    thresh[1],
    cv.THRESH_BINARY_INV + cv.THRESH_OTSU
  );
  printHist(mat, threshDialogMat, histogramRectR);
  paintMat(mat, threshDialogMat, subtitleRect, red);
  return mat;
}
