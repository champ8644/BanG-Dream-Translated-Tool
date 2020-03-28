import {
  blue,
  nameLabelCrop,
  purple,
  red,
  subtitlePartialCrop,
  thickness
} from '../constants';

import cv from 'opencv4nodejs';
import makeNameLabel from '../mainFunctions/makeNameLabel';
import subtitleFinder from './subtitleFinder';

const { outerX, outerY } = nameLabelCrop;
const rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const { rectX, rectY } = subtitlePartialCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function nameLabelGenerator(mat) {
  const { status, actor, percentDiff } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    const dialogMat = subtitleFinder(mat);
    // eslint-disable-next-line no-console
    console.log({ dialog: dialogMat.countNonZero(), actor });
    mat.drawRectangle(rectOuterNameLabel, blue, thickness);
    dialogMat.cvtColor(cv.COLOR_GRAY2BGR).copyTo(mat.getRegion(subtitleRect));
    mat.drawRectangle(subtitleRect, red, thickness);
    mat.putText(
      `${dialogMat.countNonZero()}`,
      new cv.Point2(rectX[0] + 1450, rectY[0] + 180),
      cv.FONT_HERSHEY_COMPLEX,
      2,
      purple,
      cv.LINE_4,
      1
    );
    return mat;
  }
  return mat;
}
