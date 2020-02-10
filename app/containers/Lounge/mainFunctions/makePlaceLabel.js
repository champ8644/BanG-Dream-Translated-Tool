import {
  placeLabelCrop,
  placeLabelThreshold,
  threshPlacePercentDiff
} from '../constants';

import cv from 'opencv4nodejs';
import placeNameFinder from './placeNameFinder';

const CapturePlaceLabel = cv
  .imread('CapturePlaceLabelCrop.png')
  .cvtColor(cv.COLOR_BGR2GRAY);
const countPlaceLabel = CapturePlaceLabel.countNonZero();
const { outerX, outerY } = placeLabelCrop;
const rectOuterPlaceLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
export default function placeLabelGenerator(mat, refractory) {
  const { val, sat, hue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const threshMat = mat
    .getRegion(rectOuterPlaceLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CapturePlaceLabel).bitwiseXor(CapturePlaceLabel);
  const percentDiff = (masked.countNonZero() / countPlaceLabel) * 100;
  let placeName;
  if (percentDiff < threshPlacePercentDiff && !refractory)
    placeName = placeNameFinder(mat);
  return {
    percentDiff,
    status: percentDiff < threshPlacePercentDiff,
    payload: {},
    placeName
  };
}
