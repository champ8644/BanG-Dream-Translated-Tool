import cv from 'opencv4nodejs';

export default function GRAYFinder(mat, vCap) {
  const {
    colorSlider: { gray }
  } = vCap;
  const lowerColorBounds = new cv.Vec(gray[0], gray[0], gray[0]);
  const upperColorBounds = new cv.Vec(gray[1], gray[1], gray[1]);
  const masked = mat
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  return masked;
}
