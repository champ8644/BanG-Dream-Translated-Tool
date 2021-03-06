import { qualityRatio, starCrop } from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

const { rectX, rectY } = starCrop;
const starRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function starTemplater(mat) {
  const masked = mat.getRegion(starRect);
  cv.imwrite(
    PATHS.resourcePath(`CaptureStarCrop_${qualityRatio}_Temp.png`),
    masked
  );
  return masked;
}
