import { black, nameLabelCrop, nameLabelThreshold, white } from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

export default function contourFinder(mat) {
  const { innerX, outerX, innerY, outerY } = nameLabelCrop;
  const { val, sat, hue } = nameLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  const maskRect = new cv.Mat(masked.rows, masked.cols, cv.CV_8UC3);
  maskRect.drawRectangle(
    new cv.Point2(outerX[0], outerY[0]),
    new cv.Point2(outerX[1], outerY[1]),
    white,
    -1
  );
  maskRect.drawRectangle(
    new cv.Point2(innerX[0], innerY[0]),
    new cv.Point2(innerX[1], innerY[1]),
    black,
    -1
  );
  const outMat = mat.and(maskRect).and(masked);
  cv.imwrite(PATHS.resourcePath('CaptureNameLabel.png'), outMat);
  cv.imwrite(
    PATHS.resourcePath('CaptureNameLabelBGR.png'),
    outMat.cvtColor(cv.COLOR_BGR2RGB)
  );
  return outMat;
}
