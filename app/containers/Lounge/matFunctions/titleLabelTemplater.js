import { titleLabelCrop, placeLabelThreshold } from '../constants';

import cv from 'opencv4nodejs';

const { rectX, rectY } = titleLabelCrop;
const rectTitleLabel = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function titleLabelTemplater(mat) {
  const { blue, green, red } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const masked = mat
    .getRegion(rectTitleLabel)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  cv.imwrite('CaptureTitleLabelCropTemp.png', masked);
  return masked;
}
