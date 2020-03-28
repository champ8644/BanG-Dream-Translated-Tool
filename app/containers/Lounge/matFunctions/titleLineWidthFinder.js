import { placeLabelThreshold, titleLineCrop } from '../constants';

import cv from 'opencv4nodejs';

const { rectX, rectY } = titleLineCrop;
const rectTitleLabel = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function titleLineWidthFinder(mat) {
  const { hue, sat, val } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .getRegion(rectTitleLabel)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);

  const contour = masked.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  let lineRect = null;
  contour.forEach(item => {
    const rect = item.boundingRect();
    if (rect.x === 0 && rect.y === 0) {
      if (lineRect === null) lineRect = rect;
      else if (lineRect.arearect.area) lineRect = rect;
    }
  });
  if (lineRect === null) return null;
  return lineRect.width;
}
