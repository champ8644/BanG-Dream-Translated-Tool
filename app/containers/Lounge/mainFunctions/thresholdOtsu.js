import cv from 'opencv4nodejs';

/**
 * Make threshold mats
 * @param {mat} mat
 * @param {booleen} inv
 * @return {mat} threshold mat
 */
export default function thresholdOtsu(mat, inv = true) {
  if (mat.channels === 3)
    return mat
      .cvtColor(cv.COLOR_BGR2GRAY)
      .threshold(
        0,
        255,
        (inv ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY) + cv.THRESH_OTSU
      );
  return mat.threshold(0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
}
