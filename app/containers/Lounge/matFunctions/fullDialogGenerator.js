import {
  black,
  blue,
  nameLabelCrop,
  red,
  subtitleCrop,
  thickness
} from '../constants';

import cv from 'opencv4nodejs';
import makeNameLabel from '../mainFunctions/makeNameLabel';

// import subtitleFinder from './subtitleFinder';

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
// const prevSubtitleRect = new cv.Rect(
//   rectX[0],
//   rectY[0] - 200,
//   rectX[1] - rectX[0],
//   rectY[1] - rectY[0]
// );
// const diffSubtitleRect = new cv.Rect(
//   rectX[0],
//   rectY[0] - 400,
//   rectX[1] - rectX[0],
//   rectY[1] - rectY[0]
// );
// const diffSubtitleRect2 = new cv.Rect(
//   rectX[0],
//   rectY[0] - 600,
//   rectX[1] - rectX[0],
//   rectY[1] - rectY[0]
// );
const histogramRectL = new cv.Rect(620, 50, 600, 300);
const histogramRectR = new cv.Rect(1270, 50, 600, 300);

function makeGray(mat) {
  if (mat.channels === 1) return mat;
  return mat.cvtColor(cv.COLOR_BGR2GRAY);
}

function makeBGR(mat) {
  if (mat.channels === 3) return mat;
  return mat.cvtColor(cv.COLOR_GRAY2BGR);
}

function paintMat(mat, draw, rect, color = black, offsetY = 0) {
  const gray = makeGray(draw);
  const bgr = makeBGR(draw);
  bgr.copyTo(mat.getRegion(rect));
  // mat.drawRectangle(rect, color, thickness);
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
  {
    channel,
    bins: 256,
    ranges: [0, 256]
  }
];

function printHist(mat, draw, rect) {
  const grayHist = cv.calcHist(makeGray(draw), getHistAxis(0));
  const grayHistPlot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
  cv.plot1DHist(grayHist, grayHistPlot, new cv.Vec(0, 0, 0));
  paintMat(mat, grayHistPlot, rect);
}

export default function nameLabelGenerator(mat, vCap) {
  const {
    colorSlider: { thresh }
  } = vCap;
  const { status, percentDiff } = makeNameLabel(mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    mat.drawRectangle(rectOuterNameLabel, blue, thickness);
    const dialogMat = mat.getRegion(subtitleRect).cvtColor(cv.COLOR_BGR2GRAY);
    printHist(mat, dialogMat, histogramRectL);
    const threshDialogMat = dialogMat.threshold(
      thresh[0],
      thresh[1],
      cv.THRESH_BINARY
    );
    printHist(mat, threshDialogMat, histogramRectR);
    paintMat(mat, threshDialogMat, subtitleRect, red);
    return mat;
  }
  return mat;
}
