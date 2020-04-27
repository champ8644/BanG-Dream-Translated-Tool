import { subtitleFifthCrop, subtitlePartialCrop } from '../constants';

import cv from 'opencv4nodejs';
import thresholdOtsu from '../mainFunctions/thresholdOtsu';

const { rectX, rectY } = subtitlePartialCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const { rectX: rectXF, rectY: rectYF } = subtitleFifthCrop;
const subtitleRectFifth = new cv.Rect(
  rectXF[0],
  rectYF[0],
  rectXF[1] - rectXF[0],
  rectYF[1] - rectYF[0]
);
export default function subtitleFinder(mat, vCap) {
  // const { blue, green, red } = subtitleThreshold;
  // const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  // const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const matSubtitle = thresholdOtsu(mat.getRegion(subtitleRect));
  const fifthMatSubtitle = thresholdOtsu(mat.getRegion(subtitleRectFifth));
  let prevMatSubtitle = null;
  if (!vCap.prevMat.empty) {
    prevMatSubtitle = thresholdOtsu(vCap.prevMat.getRegion(subtitleRect));
  }
  return { matSubtitle, prevMatSubtitle, fifthMatSubtitle };
}
