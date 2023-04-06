import {
  black,
  placeLabelCrop,
  placeLabelThreshold,
  qualityRatio
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const { innerX, outerX, innerY, outerY } = placeLabelCrop;
const rectOuterPlaceLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const maskRect = new cv.Mat(
  rectOuterPlaceLabel.height,
  rectOuterPlaceLabel.width,
  cv.CV_8UC3,
  [255, 255, 255]
);
maskRect.drawRectangle(
  new cv.Point2(innerX[0] - outerX[0], innerY[0] - outerY[0]),
  new cv.Point2(innerX[1] - outerX[0], innerY[1] - outerY[0]),
  black,
  -1
);

export default function placeLabelTemplater(mat) {
  const { hue, sat, val } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .getRegion(rectOuterPlaceLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR)
    .and(maskRect);
  cv.imwrite(
    PATHS.resourcePath(`CapturePlaceLabelCrop_${qualityRatio}.png`),
    masked
  );
  cv.imwrite(
    PATHS.resourcePath(`CapturePlaceLabelCrop_${qualityRatio}.png`),
    masked
  );
  return masked;
}
