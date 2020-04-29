import cv from 'opencv4nodejs';

export function thresholdOtsu(mat, inv = true) {
  const grayMat = mat.channels === 3 ? mat.cvtColor(cv.COLOR_BGR2GRAY) : mat;
  return grayMat.threshold(
    0,
    255,
    (inv ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY) + cv.THRESH_OTSU
  );
}

export function adaptiveThreshold(mat, inv = true) {
  const grayMat = mat.channels === 3 ? mat.cvtColor(cv.COLOR_BGR2GRAY) : mat;
  return grayMat.adaptiveThreshold(
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    inv ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY,
    31,
    20
  );
}
