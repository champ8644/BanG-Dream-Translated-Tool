import {
  nameLabelCrop,
  nameLabelStarCrop,
  nameLabelThreshold,
  qualityRatio,
  rx,
  threshPercentDiff
} from '../constants';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';
import subtitleFinder from './subtitleFinder';
import { thresholdOtsu } from '../utils/thresholdCv';

let CaptureNameLabel;
try {
  CaptureNameLabel = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelCrop_${qualityRatio}.png`))
    .cvtColor(cv.COLOR_BGR2GRAY);
} catch {
  CaptureNameLabel = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelCrop.png`))
    .rescale(rx)
    .cvtColor(cv.COLOR_BGR2GRAY);
}
const countNameLabel = CaptureNameLabel.countNonZero();
const { innerX, outerX, innerY, outerY } = nameLabelCrop;
const _rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const rectNameLabel = new cv.Rect(
  innerX[0] - outerX[0],
  innerY[0] - outerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
);
const { rectX, rectY } = nameLabelStarCrop;
const rectNameLabelStarCropRelative = new cv.Rect(
  rectX[0] - outerX[0],
  rectY[0] - outerY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const { val, sat, hue } = nameLabelThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

export default function makeNameLabel(mat, starMove) {
  let rectOuterNameLabel;
  if (starMove) {
    rectOuterNameLabel = new cv.Rect(
      _rectOuterNameLabel.x + starMove.x,
      _rectOuterNameLabel.y + starMove.y,
      _rectOuterNameLabel.width,
      _rectOuterNameLabel.height
    );
  } else {
    rectOuterNameLabel = _rectOuterNameLabel;
  }

  const scopeMat = mat.getRegion(rectOuterNameLabel);
  const threshMat = scopeMat
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  const masked = threshMat.and(CaptureNameLabel).bitwiseXor(CaptureNameLabel);
  const percentDiff = (masked.countNonZero() / countNameLabel) * 100;
  let actor;
  let actorStar;
  let dialog = null;
  if (percentDiff < threshPercentDiff) {
    actor = thresholdOtsu(scopeMat.getRegion(rectNameLabel), null);
    actorStar = threshMat.getRegion(rectNameLabelStarCropRelative);
    dialog = subtitleFinder(mat);
  }
  return {
    percentDiff,
    status: percentDiff < threshPercentDiff,
    actor,
    actorStar,
    dialog,
    threshMat,
    masked
  };
}
