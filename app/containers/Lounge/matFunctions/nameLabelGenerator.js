import {
  blue,
  green,
  nameLabelCrop,
  purple,
  red,
  subtitleFifthCrop,
  subtitlePartialCrop,
  thickness,
  yellow
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
const { rectX: rectXF, rectY: rectYF } = subtitleFifthCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const subtitleRectFifth = new cv.Rect(
  rectXF[0],
  rectYF[0],
  rectXF[1] - rectXF[0],
  rectYF[1] - rectYF[0]
);
const prevSubtitleRect = new cv.Rect(
  rectX[0],
  rectY[0] - 200,
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const diffSubtitleRect = new cv.Rect(
  rectX[0],
  rectY[0] - 400,
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
const diffSubtitleRect2 = new cv.Rect(
  rectX[0],
  rectY[0] - 600,
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);
function paintMat(mat, draw, rect, color, offsetY = 0) {
  draw.cvtColor(cv.COLOR_GRAY2BGR).copyTo(mat.getRegion(rect));
  mat.drawRectangle(rect, color, thickness);
  mat.putText(
    `${draw.countNonZero()}`,
    new cv.Point2(rect.x + rect.width + 50, rect.y + 50 + offsetY),
    cv.FONT_HERSHEY_COMPLEX,
    2,
    color,
    cv.LINE_4,
    1
  );
}

export default function nameLabelGenerator(mat, vCap) {
  const { status, actor, percentDiff } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    const dialogMat = subtitleFinder(mat, vCap); // matSubtitle, prevMatSubtitle
    // eslint-disable-next-line no-console
    console.log({ dialog: dialogMat.matSubtitle.countNonZero(), actor });
    mat.drawRectangle(rectOuterNameLabel, blue, thickness);
    paintMat(mat, dialogMat.matSubtitle, subtitleRect, red);
    paintMat(mat, dialogMat.fifthMatSubtitle, subtitleRectFifth, green, 100);
    if (dialogMat.prevMatSubtitle) {
      paintMat(mat, dialogMat.prevMatSubtitle, prevSubtitleRect, yellow);
      const sub = dialogMat.prevMatSubtitle.sub(dialogMat.matSubtitle);
      paintMat(mat, sub, diffSubtitleRect, blue);
      const revSub = dialogMat.matSubtitle.sub(dialogMat.prevMatSubtitle);
      paintMat(mat, revSub, diffSubtitleRect2, purple);
    }

    return mat;
  }
  return mat;
}
