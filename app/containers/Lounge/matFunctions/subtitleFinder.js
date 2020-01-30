import cv from 'opencv4nodejs';

export default function subtitleFinder(mat) {
  const red = new cv.Vec(0, 0, 255);
  mat.drawCircle(
    new cv.Point(500 + 100 / 2, 500 + 100 / 2),
    5,
    red,
    20,
    cv.FILLED
  );
  return mat;
}
