import cv from 'opencv4nodejs';
import { paintMat, writeMat } from '../utils/utilityCv';
import makePlaceLabel from '../mainFunctions/makePlaceLabel';
import makeTitleLabel from '../mainFunctions/makeTitleLabel';
import titleLineWidthFinder from './titleLineWidthFinder';
import {
  nameLabelCrop,
  subtitlePartialCrop,
  color,
  placeLabelCrop,
  titleHeader
} from '../constants';
import { thresholdOtsu, adaptiveThreshold } from '../utils/thresholdCv';

const { outerX: actX, outerY: actY } = nameLabelCrop;
const { rectX: subtX, rectY: subtY } = subtitlePartialCrop;
export function addNameMat(mat, star = { x: 0, y: 0 }) {
  const subtitleRect = new cv.Rect(
    subtX[0] + star.x,
    subtY[0] + star.y,
    subtX[1] - subtX[0],
    subtY[1] - subtY[0]
  );
  const actorRect = new cv.Rect(
    actX[0] + star.x,
    actY[0] + star.y,
    actX[1] - actX[0],
    actY[1] - actY[0]
  );
  const subtitleMat = adaptiveThreshold(mat.getRegion(subtitleRect));
  const actorMat = thresholdOtsu(mat.getRegion(actorRect), null);
  paintMat(mat, actorMat, actorRect, color.blue);
  paintMat(mat, subtitleMat, subtitleRect, color.red);
  return mat;
}

const {
  outerX: outerPX,
  outerY: outerPY,
  innerX: innerPX,
  innerY: innerPY
} = placeLabelCrop;
const outerPlaceRect = new cv.Rect(
  outerPX[0],
  outerPY[0],
  outerPX[1] - outerPX[0],
  outerPY[1] - outerPY[0]
);
const innerPlaceRect = new cv.Rect(
  innerPX[0],
  innerPY[0],
  innerPX[1] - innerPX[0],
  innerPY[1] - innerPY[0]
);
export function addPlaceMat(mat) {
  const { status, placeName, threshMat } = makePlaceLabel(mat);
  if (status) {
    paintMat(mat, threshMat, outerPlaceRect, color.blue);
    paintMat(mat, placeName, innerPlaceRect, color.red);
  }
  return mat;
}

export function addTitleMat(mat) {
  const { status } = makeTitleLabel(mat);
  if (status) {
    const titleWidth = titleLineWidthFinder(mat);
    const titleRect = new cv.Rect(
      titleHeader.x,
      titleHeader.y,
      titleWidth,
      titleHeader.height
    );
    const titleMat = thresholdOtsu(mat.getRegion(titleRect), null);
    paintMat(mat, titleMat, titleRect, color.blue);
  }
  return mat;
}

export function addWhiteMat(mat) {
  writeMat(mat, 'White', [50, 50], color.black);
  return mat;
}

export function addBlackMat(mat) {
  writeMat(mat, 'Black', [50, 50], color.white);
  return mat;
}
