import { adaptiveThreshold } from '../utils/thresholdCv';
import cv from 'opencv4nodejs';
import { subtitlePartialCrop } from '../constants';

const { rectX, rectY } = subtitlePartialCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function subtitleFinder(mat) {
  // const { blue, green, red } = subtitleThreshold;
  // const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  // const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  return adaptiveThreshold(mat.getRegion(subtitleRect));
}
