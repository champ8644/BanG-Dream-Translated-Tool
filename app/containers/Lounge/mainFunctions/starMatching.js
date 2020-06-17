import {
  nameLabelCrop,
  nameLabelStarROI,
  threshStarMatching
} from '../constants';

// import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';

// nameLabelThreshold,
// nameLabelStarCrop,
// threshPercentDiff,
// qualityRatio,
// rx,

// let CaptureNameLabelStar;
// try {
//   CaptureNameLabelStar = cv
//     .imread(PATHS.resourcePath(`CaptureNameLabelStar_${qualityRatio}.png`))
//     .cvtColor(cv.COLOR_BGR2HSV)
//     .inRange(lowerColorBounds, upperColorBounds);
// } catch {
//   CaptureNameLabelStar = cv
//     .imread(PATHS.resourcePath(`CaptureNameLabelStar.png`))
//     .rescale(rx)
//     .cvtColor(cv.COLOR_BGR2HSV)
//     .inRange(lowerColorBounds, upperColorBounds);
// }

const { innerX, innerY } = nameLabelCrop;
// const { val, sat, hue } = nameLabelThreshold;
// const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
// const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

const { rectX: roiX, rectY: roiY } = nameLabelStarROI;
const nameLabelStarRegion = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);

// const { rectX, rectY } = nameLabelStarCrop;

// const rectNameLabelStarCrop = new cv.Rect(
//   rectX[0],
//   rectY[0],
//   rectX[1] - rectX[0],
//   rectY[1] - rectY[0]
// );

export default function starMatching(mat, currentActor) {
  // const threshMat = mat
  //   .getRegion(rectNameLabelStarCrop)
  //   .cvtColor(cv.COLOR_BGR2HSV)
  //   .inRange(lowerColorBounds, upperColorBounds)
  //   .bitwiseXor(CaptureNameLabelStar);
  // const percentDiff =
  //   (threshMat.countNonZero() / threshMat.rows / threshMat.cols) * 100;
  // if (percentDiff < threshPercentDiff) return { x: 0, y: 0 };

  const { maxLoc, maxVal } = mat
    .getRegion(nameLabelStarRegion)
    .cvtColor(cv.COLOR_BGR2GRAY)
    .matchTemplate(
      currentActor.cvtColor(cv.COLOR_BGR2GRAY),
      cv.TM_CCOEFF_NORMED
    )
    .minMaxLoc();
  if (maxVal > threshStarMatching) {
    return {
      x: maxLoc.x + roiX[0] - innerX[0],
      y: maxLoc.y + roiY[0] - innerY[0]
    };
  }
  return null;
}
