import { color, thickness, titleHeader } from '../constants';

import cv from 'opencv4nodejs';
import makeTitleLabel from '../mainFunctions/makeTitleLabel';
import titleLineWidthFinder from './titleLineWidthFinder';

export default function titleLabelGenerator(mat) {
  // eslint-disable-next-line no-console
  const { percentDiff, status, titleCrop } = makeTitleLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    // eslint-disable-next-line no-console
    console.log('titleCrop: ', titleCrop.countNonZero());
    const titleWidth = titleLineWidthFinder(mat);
    const drawRect = new cv.Rect(
      titleHeader.x,
      titleHeader.y,
      titleWidth,
      titleHeader.height
    );
    mat.drawRectangle(drawRect, color.blue, thickness);
  }
  return mat;
}
