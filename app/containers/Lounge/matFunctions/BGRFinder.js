import cv from 'opencv4nodejs';

export default function BGRFinder(mat, vCap) {
  const {
    colorSlider: { blue, green, red }
  } = vCap;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const masked = mat
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  return masked;
}
