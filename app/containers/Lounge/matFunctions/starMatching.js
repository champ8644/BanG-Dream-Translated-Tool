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

const maxOrMin = {
  TM_SQDIFF: 0,
  TM_SQDIFF_NORMED: 0,
  TM_CCORR: 1,
  TM_CCORR_NORMED: 1,
  TM_CCOEFF: 1,
  TM_CCOEFF_NORMED: 1
};

function bakeMinMax(minMax, type) {
  if (maxOrMin[type] === 0)
    return {
      minL: `{${minMax.minLoc.x + roiX[0] - innerX[0]},${minMax.minLoc.y +
        roiY[0] -
        innerY[0]}}`,
      minV: minMax.minVal
    };
  return {
    maxL: `{${minMax.maxLoc.x + roiX[0] - innerX[0]},${minMax.maxLoc.y +
      roiY[0] -
      innerY[0]}}`,
    maxV: minMax.maxVal
  };
}

export default function starMatching(mat, vCap) {
  let prevMat = vCap.getSnapShot();

  if (!prevMat) {
    if (vCap.prevMat.empty) ({ prevMat } = vCap);
    else prevMat = mat;
  }
  if (prevMat.empty) prevMat = mat;

  const actor = prevMat
    .getRegion(rectInnerNameLabel)
    .cvtColor(cv.COLOR_BGR2GRAY);
  const threshMat = mat
    .getRegion(rectNameLabelStarCrop)
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .bitwiseXor(CaptureNameLabelStar);
  const percentDiff =
    (threshMat.countNonZero() / threshMat.rows / threshMat.cols) * 100;
  if (percentDiff < threshPercentDiff) {
    const matchRect = new cv.Rect(
      rectInnerNameLabel.x,
      rectInnerNameLabel.y,
      rectInnerNameLabel.width,
      rectInnerNameLabel.height
    );
    mat.drawRectangle(matchRect, color.yellow, thickness);
    writeMat(
      mat,
      `${percentDiff} < ${threshPercentDiff}`,
      [685, 1220],
      color.black
    );

    return mat;
  }

  let getMatched;
  let normGetMatched;
  const normGetmatchedPaint = [];
  const textMatchProps = [];
  const choosenOne = 'TM_CCOEFF_NORMED';

  const matFindField = mat
    .getRegion(nameLabelStarRegion)
    .cvtColor(cv.COLOR_BGR2GRAY);
  [
    'TM_SQDIFF',
    'TM_SQDIFF_NORMED',
    'TM_CCORR',
    'TM_CCORR_NORMED',
    'TM_CCOEFF',
    'TM_CCOEFF_NORMED'
  ].forEach(item => {
    const getMatchedEach = matFindField.matchTemplate(actor, cv[item]);
    const normGetMatchedEach = getMatchedEach.normalize(
      0,
      255,
      cv.NORM_MINMAX,
      cv.CV_8UC1
    );
    if (choosenOne === item) {
      getMatched = getMatchedEach;
      normGetMatched = normGetMatchedEach;
    }
    normGetmatchedPaint.push(normGetMatchedEach);
    textMatchProps.push(bakeMinMax(getMatchedEach.minMaxLoc(), item));
  });
  const normRect = mat2Rect(
    nameLabelStarRegion.x,
    nameLabelStarRegion.y,
    normGetMatched
  );
  paintMat(
    mat,
    normGetmatchedPaint,
    normRect,
    color.yellow,
    -nameLabelStarRegion.height * 3,
    textMatchProps
  );

  const matchProps = getMatched.minMaxLoc();
  const { maxLoc, maxVal } = matchProps;

  // eslint-disable-next-line no-console
  console.log('diff', {
    x: maxLoc.x + roiX[0] - innerX[0],
    y: maxLoc.y + roiY[0] - innerY[0]
  });

  paintMat(mat, matFindField, nameLabelStarRegion, color.black);

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
    paintMat(
      mat,
      [actor, mat.getRegion(matchRect)],
      rectInnerNameLabel,
      color.red,
      [normRect.width * 2 - 142, -nameLabelStarRegion.height - 32]
    );
    mat.drawRectangle(matchRect, color.yellow, thickness);
    writeMat(mat, `{${diff.x},${diff.y}}`, [685, 1220], color.purple);
    writeMat(mat, `[${formatNumber(maxVal)}]`, [994, 1220], color.blue);
  }
  return mat;
}
