import { black, thickness } from '../constants';

import cv from 'opencv4nodejs';

export function mat2Rect(x, y, mat) {
  return new cv.Rect(x, y, mat.cols, mat.rows);
}

export function makeGray(mat) {
  if (mat.channels === 1) return mat;
  return mat.cvtColor(cv.COLOR_BGR2GRAY);
}

export function makeBGR(mat) {
  if (mat.channels === 3) return mat;
  return mat.cvtColor(cv.COLOR_GRAY2BGR);
}

function getPoint(point) {
  let x;
  let y;
  if (Array.isArray(point)) [x, y] = point;
  else ({ x, y } = point);
  return new cv.Point2(x, y);
}

export function dotMat(
  mat,
  point,
  color = black,
  border = cv.FILLED,
  size = 5
) {
  mat.drawCircle(getPoint(point), size, color, border);
}

export function writeMat(mat, text, point, color = black) {
  mat.putText(
    text,
    getPoint(point),
    cv.FONT_HERSHEY_COMPLEX,
    2,
    color,
    cv.LINE_4,
    1
  );
}

export function paintMat(mat, draw, rect, color = black, offsetAll) {
  let offsetX = 0;
  let offsetY = 0;
  if (Number.isInteger(offsetAll)) {
    offsetY = offsetAll;
  } else if (Array.isArray(offsetAll)) {
    [offsetX, offsetY] = offsetAll;
  }
  if (isNaN(offsetX)) offsetX = 0;
  if (isNaN(offsetY)) offsetY = 0;
  const exe = (frame, offset) => {
    const gray = makeGray(frame);
    const bgr = makeBGR(frame);
    const _rect = new cv.Rect(
      rect.x + offset.x,
      rect.y + offset.y,
      rect.width,
      rect.height
    );
    bgr.copyTo(mat.getRegion(_rect));
    mat.drawRectangle(_rect, color, thickness);
    mat.putText(
      `${gray.countNonZero()}`,
      new cv.Point2(_rect.x + 600 + offset.x, _rect.y - 50 + offset.y),
      cv.FONT_HERSHEY_COMPLEX,
      2,
      color || black,
      cv.LINE_4,
      1
    );
  };
  if (Array.isArray(draw))
    draw.forEach((frame, idx) =>
      exe(frame, {
        x: offsetX,
        y: Math.round((idx - draw.length / 2) * rect.height) + offsetY
      })
    );
  else exe(draw, { x: offsetX, y: offsetY });
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
