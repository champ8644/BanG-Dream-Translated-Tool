import {
  color,
  nameLabelCrop,
  nameLabelStarCrop,
  nameLabelStarROI,
  nameLabelThreshold,
  qualityRatio,
  rx,
  thickness,
  threshPercentDiff,
  threshStarMatching
} from '../constants';
import { mat2Rect, paintMat, writeMat } from '../utils/utilityCv';

import { PATHS } from '../../../utils/paths';
import cv from 'opencv4nodejs';
import { formatNumber } from '../constants/function';
import { thresholdOtsu } from '../utils/thresholdCv';

const { val, sat, hue } = nameLabelThreshold;
const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);

let CaptureNameLabelStar;
try {
  CaptureNameLabelStar = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelStar_${qualityRatio}.png`))
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
} catch {
  CaptureNameLabelStar = cv
    .imread(PATHS.resourcePath(`CaptureNameLabelStar.png`))
    .rescale(rx)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
}

const { rectX: roiX, rectY: roiY } = nameLabelStarROI;
const nameLabelStarRegion = new cv.Rect(
  roiX[0],
  roiY[0],
  roiX[1] - roiX[0],
  roiY[1] - roiY[0]
);
const { rectX, rectY } = nameLabelStarCrop;

const rectNameLabelStarCrop = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

const { innerX, innerY } = nameLabelCrop;
const rectInnerNameLabel = new cv.Rect(
  innerX[0],
  innerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
);

export default function starMatching(mat, vCap) {
  let prevMat;
  if (!vCap.prevMat.empty) ({ prevMat } = vCap);
  else prevMat = mat;
  const actor = thresholdOtsu(prevMat.getRegion(rectInnerNameLabel), null);

  const threshMat = mat
    .getRegion(rectNameLabelStarCrop)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseXor(CaptureNameLabelStar);
  const percentDiff =
    (threshMat.countNonZero() / threshMat.rows / threshMat.cols) * 100;
  if (percentDiff < threshPercentDiff) {
    return {
      x: 0,
      y: 0
    };
  }
  // const arr = [
  //   cv.TM_SQDIFF,
  //   cv.TM_SQDIFF_NORMED,
  //   cv.TM_CCORR,
  //   cv.TM_CCORR_NORMED,
  //   cv.TM_CCOEFF,
  //   cv.TM_CCOEFF_NORMED
  // ];
  // const arrColor = [
  //   color.red,
  //   color.blue,
  //   color.green,
  //   color.yellow,
  //   color.cyan,
  //   color.purple
  // ];
  // const arrValid = [1, 1, 1, 1, 1, 1];
  // const i = 3;
  // for (let i = 0; i < 6; i++) {
  // if (arrValid[i]) {
  const roiRangeTest = mat
    .getRegion(nameLabelStarRegion)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseNot();
  const roiEdges = roiRangeTest.canny(0, 255, 7);
  const actorEdges = actor.canny(0, 255, 7);
  // const roiRangeTest = thresholdOtsu(mat.getRegion(nameLabelStarRegion), null);
  // .normalize(0, 1, cv.NORM_MINMAX, -1)
  const getMatched = roiEdges.matchTemplate(
    actorEdges,
    cv.TM_CCORR_NORMED,
    actor
  );
  const normGetMatched = getMatched.convertTo(cv.CV_8UC1, 255, 0);

  const matchProps = getMatched.minMaxLoc();
  const { maxLoc, maxVal } = matchProps;

  // const matchLoc =
  //   arr[i] === cv.TM_SQDIFF || arr[i] === cv.TM_SQDIFF_NORMED ? minLoc : maxLoc;
  // const matchVal =
  //   arr[i] === cv.TM_SQDIFF || arr[i] === cv.TM_SQDIFF_NORMED ? minVal : maxVal;
  // matchLoc.x += roiX[0];
  // matchLoc.y += roiY[0];

  // eslint-disable-next-line no-console
  console.log('diff', {
    x: maxLoc.x + roiX[0] - innerX[0],
    y: maxLoc.y + roiY[0] - innerY[0]
  });
  // console.log('max', { x: maxLoc.x, y: maxLoc.y });
  // mat.drawRectangle(getStar, arrColor[i], thickness);
  //   }
  // }

  const normRect = mat2Rect(
    nameLabelStarRegion.x,
    nameLabelStarRegion.y,
    normGetMatched
  );
  paintMat(mat, roiEdges, nameLabelStarRegion, color.black);
  paintMat(
    mat,
    normGetMatched,
    normRect,
    color.blue,
    -nameLabelStarRegion.height
  );
  if (actor)
    paintMat(mat, actorEdges, rectInnerNameLabel, color.red, [
      normRect.width * 2 - 142,
      -nameLabelStarRegion.height - 32
    ]);
  // eslint-disable-next-line no-console
  console.log({ maxVal, maxLoc, threshStarMatching });
  if (maxVal > threshStarMatching) {
    const diff = {
      x: maxLoc.x + roiX[0] - innerX[0],
      y: maxLoc.y + roiY[0] - innerY[0]
    };
    const matchRect = new cv.Rect(
      rectInnerNameLabel.x + diff.x,
      rectInnerNameLabel.y + diff.y,
      rectInnerNameLabel.width,
      rectInnerNameLabel.height
    );
    mat.drawRectangle(matchRect, color.yellow, thickness);
    writeMat(mat, `{${diff.x},${diff.y}}`, [685, 1220], color.purple);
    writeMat(mat, `[${formatNumber(maxVal)}]`, [994, 1220], color.blue);
  }
  return mat;
}
