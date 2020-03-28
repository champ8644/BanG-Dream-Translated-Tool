import {
  black,
  nameLabelCrop,
  nameLabelStarCrop,
  nameLabelThreshold,
  qualityRatio
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const { innerX, outerX, innerY, outerY } = nameLabelCrop;
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
const rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const { rectX, rectY } = nameLabelStarCrop;
const rectNameLabelStarCrop = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function nameLabelTemplater(mat) {
  const { val, sat, hue } = nameLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .getRegion(rectOuterNameLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR)
    .and(maskRect);
  cv.imwrite(
    PATHS.resourcePath(`CaptureNameLabelCrop_${qualityRatio}_Temp.png`),
    masked
  );
  const mask2 = mat.getRegion(rectNameLabelStarCrop);
  cv.imwrite(
    PATHS.resourcePath(`CaptureNameLabelStar_${qualityRatio}_Temp.png`),
    mask2
  );
  return mask2;
}
