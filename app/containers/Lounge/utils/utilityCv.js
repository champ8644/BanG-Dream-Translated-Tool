import { black, thickness } from '../constants';

import cv from 'opencv4nodejs';

export function makeGray(mat) {
  if (mat.channels === 1) return mat;
  return mat.cvtColor(cv.COLOR_BGR2GRAY);
}

export function makeBGR(mat) {
  if (mat.channels === 3) return mat;
  return mat.cvtColor(cv.COLOR_GRAY2BGR);
}
export function paintMat(mat, draw, rect, color = black, offsetY = 0) {
  const gray = makeGray(draw);
  const bgr = makeBGR(draw);
  bgr.copyTo(mat.getRegion(rect));
  mat.drawRectangle(rect, color, thickness);
  mat.putText(
    `${gray.countNonZero()}`,
    new cv.Point2(rect.x + 600, rect.y - 50 + offsetY),
    cv.FONT_HERSHEY_COMPLEX,
    2,
    color || black,
    cv.LINE_4,
    1
  );
}

const getHistAxis = channel => [
  new cv.HistAxes({
    channel,
    bins: 256,
    ranges: [0, 256]
  })
];

export function printHist(mat, draw, rect) {
  const grayHist = cv.calcHist(makeGray(draw), getHistAxis(0));
  const grayHistPlot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
  cv.plot1DHist(grayHist, grayHistPlot, new cv.Vec(0, 0, 0));
  paintMat(mat, grayHistPlot, rect);
}
