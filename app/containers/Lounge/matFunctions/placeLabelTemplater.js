import { black, placeLabelCrop, placeLabelThreshold } from '../constants';

import cv from 'opencv4nodejs';

const { innerX, outerX, innerY, outerY } = placeLabelCrop;
const maskRect = new cv.Mat(
  outerY[1] - outerY[0],
  outerX[1] - outerX[0],
  cv.CV_8UC3,
  [255, 255, 255]
);
maskRect.drawRectangle(
  new cv.Point2(innerX[0] - outerX[0], innerY[0] - outerY[0]),
  new cv.Point2(innerX[1] - outerX[0], innerY[1] - outerY[0]),
  black,
  -1
);
const rectOuterPlaceLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);

export default function placeLabelTemplater(mat) {
  const { blue, green, red } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const masked = mat
    .getRegion(rectOuterPlaceLabel)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR)
    .and(maskRect);
  cv.imwrite('CapturePlaceLabelCropTemp.png', masked);
  return masked;
}
