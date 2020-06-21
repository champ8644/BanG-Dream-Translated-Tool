import { black, dialogPartialDiffThreshold } from '../constants';

import cv from 'opencv4nodejs';

function subTractBorder(mat) {
  const contours = mat.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  const copy = mat.copy();
  copy.drawContours(
    contours.map(item => item.getPoints()),
    -1,
    black,
    1,
    cv.LINE_8
  );
  return copy;
}

export default function isNewDialog(next, prev) {
  if (prev === null) return true;
  if (next === null) return true;
  // console.log({
  //   val: prev.sub(next).countNonZero(),
  //   bool: prev.sub(next).countNonZero() > dialogPartialDiffThreshold
  // });
  const subtractedPrev = subTractBorder(prev);
  // if (test) {
  //   console.log(
  //     'subtractedPrev.sub(next).countNonZero(): ',
  //     subtractedPrev.sub(next).countNonZero()
  //   );
  //   console.log('dialogPartialDiffThreshold: ', dialogPartialDiffThreshold);
  // }
  return subtractedPrev.sub(next).countNonZero() > dialogPartialDiffThreshold;
}
