import { blue, nameLabelCrop, red, subtitleCrop } from '../constants';

import cv from 'opencv4nodejs';
import makeNameLabel from '../mainFunctions/makeNameLabel';

const { outerX, outerY } = nameLabelCrop;
const rectOuterNameLabel = new cv.Rect(
  outerX[0],
  outerY[0],
  outerX[1] - outerX[0],
  outerY[1] - outerY[0]
);
const { rectX, rectY } = subtitleCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function nameLabelGenerator(mat) {
  const { status, dialog, actor, percentDiff } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    // eslint-disable-next-line no-console
    console.log({ dialog, actor });
    mat.drawRectangle(rectOuterNameLabel, blue, 1);
    mat.drawRectangle(subtitleRect, red, 1);
  }
  return mat;
}
