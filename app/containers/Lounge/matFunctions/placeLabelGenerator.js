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
export default function placeLabelGenerator(mat) {
  const { red, green, blue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const threshMat = mat
    .getRegion(rectOuterPlaceLabel)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CapturePlaceLabel).bitwiseXor(CapturePlaceLabel);
  const percentDiff = (masked.countNonZero() / countPlaceLabel) * 100;
  if (percentDiff < threshPlacePercentDiff) {
    const placeName = placeNameFinder(mat);
    // eslint-disable-next-line no-console
    console.log({ placeName: placeName.countNonZero() });
    return placeName;
  }
  return masked;
}
