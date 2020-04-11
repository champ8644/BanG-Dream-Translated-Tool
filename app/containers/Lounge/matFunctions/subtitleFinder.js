import { subtitlePartialCrop, subtitleThreshold } from '../constants';

import cv from 'opencv4nodejs';

const { rectX, rectY } = subtitlePartialCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function subtitleFinder(mat, vCap) {
  const { blue, green, red } = subtitleThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const matSubtitle = mat
    .getRegion(subtitleRect)
    .inRange(lowerColorBounds, upperColorBounds);
  let prevMatSubtitle = null;
  if (!vCap.prevMat.empty) {
    prevMatSubtitle = vCap.prevMat
      .getRegion(subtitleRect)
      .inRange(lowerColorBounds, upperColorBounds);
  }
  return { matSubtitle, prevMatSubtitle };
}
