import {
  black,
  blue,
  green,
  nameLabelCrop,
  purple,
  red,
  subtitleFifthCrop,
  subtitlePartialCrop,
  yellow
} from '../constants';

import cv from 'opencv4nodejs';
import makeNameLabel from '../mainFunctions/makeNameLabel';
import { paintMat } from '../utils/utilityCv';
import subtitleFinder from './subtitleFinder';

const { innerX, innerY } = nameLabelCrop;
const rectInnerNameLabel = new cv.Rect(
  innerX[0],
  innerY[0],
  innerX[1] - innerX[0],
  innerY[1] - innerY[0]
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

function subTractBorder(mat) {
  const contours = mat.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  const copy = mat.copy();
  copy.drawContours(
    contours.map(item => item.getPoints()),
    -1,
    black,
    1,
    cv.LINE_8
  );
  return copy;
}

export default function nameLabelGenerator(mat, vCap) {
  const {
    status,
    currentActor: { actor },
    percentDiff
  } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff, status);
  if (status) {
    const dialogMat = subtitleFinder(mat, vCap); // matSubtitle, prevMatSubtitle
    // eslint-disable-next-line no-console
    console.log({ dialog: dialogMat.matSubtitle.countNonZero(), actor });
    paintMat(mat, actor, rectInnerNameLabel, blue);
    paintMat(mat, dialogMat.matSubtitle, subtitleRect, red);
    paintMat(mat, dialogMat.fifthMatSubtitle, subtitleRectFifth, green, 100);
    if (dialogMat.prevMatSubtitle) {
      paintMat(
        mat,
        dialogMat.prevMatSubtitle,
        prevSubtitleRect,
        yellow,
        null,
        dialogMat.prevMatSubtitle.countNonZero()
      );
      const nextBordered = subTractBorder(dialogMat.prevMatSubtitle);
      const sub = nextBordered.sub(dialogMat.matSubtitle);
      paintMat(mat, sub, diffSubtitleRect, blue, null, sub.countNonZero());
      // const revSub = dialogMat.matSubtitle.sub(dialogMat.prevMatSubtitle);
      paintMat(
        mat,
        nextBordered,
        diffSubtitleRect2,
        purple,
        null,
        nextBordered.countNonZero()
      );
    }

    return mat;
  }
  return mat;
}
