import cv from 'opencv4nodejs';

export default function BGRFinder(mat, vCap) {
  const {
    colorSlider: { hue, sat, val }
  } = vCap;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const masked = mat
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  return masked;
}
