// import { blue, placeLabelCrop, placeLabelThreshold, red } from '../constants';

import cv from 'opencv4nodejs';
import makePlaceLabel from '../mainFunctions/makePlaceLabel';
import { placeLabelThreshold } from '../constants';

// import { paintMat } from '../utils/utilityCv';
// import { thresholdOtsu } from '../utils/thresholdCv';

// const { outerX, outerY, innerX, innerY } = placeLabelCrop;
// const rectOuterPlaceLabel = new cv.Rect(
//   outerX[0],
//   outerY[0],
//   outerX[1] - outerX[0],
//   outerY[1] - outerY[0]
// );
// const rectPlaceLabel = new cv.Rect(
//   innerX[0],
//   innerY[0],
//   innerX[1] - innerX[0],
//   innerY[1] - innerY[0]
// );

function findingContour(mat) {
  const contours = mat
    // .threshold(240, 255, cv.THRESH_BINARY)
    .findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  contours.sort((a, b) => a.area - b.area);
  // eslint-disable-next-line no-console
  console.log('contours: ', contours);
  // const outObj = [];
  // contours.forEach(item => {
  //   // if (item.area > 5000) {
  //   const peri = item.arcLength(true);
  //   const approx = item.approxPolyDP(0.04 * peri, true);
  //   if (approx.length === 4) {
  //     const approxContour = new cv.Contour(approx);
  //     if (isFinalContour(approxContour)) {
  //       const finalRect = approxContour.boundingRect();
  //       outObj.push(finalRect);
  //       frame.drawContours([approx], -1, blue, 1);
  //       frame.drawContours([item.getPoints()], -1, green, 1);
  //       frame.drawRectangle(item.boundingRect(), green, 1);
  //       frame.drawRectangle(finalRect, red, 3);
  //       frame.drawCircle(
  //         new cv.Point(
  //           finalRect.x + finalRect.width / 2,
  //           finalRect.y + finalRect.height / 2
  //         ),
  //         5,
  //         red,
  //         10,
  //         cv.FILLED
  //       );
  //     }
  //     // }
  //   }
  // });
}

export default function placeLabelGenerator(mat, vCap) {
  const { val, sat, hue } = placeLabelThreshold;
  const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const { percentDiff, status, placeName } = makePlaceLabel(mat);
  const _mat = mat
    .cvtColor(cv.COLOR_BGR2HSV)
    .inRange(lowerColorBounds, upperColorBounds);
  findingContour(_mat);
  // eslint-disable-next-line no-console
  console.log('percentDiff: ', percentDiff);
  if (status) {
    // paintMat(_mat, threshMat, rectOuterPlaceLabel, blue);
    // paintMat(_mat, placeName, rectPlaceLabel, red);
    // paintMat(mat, roiMat, rectOuterPlaceLabel, blue);
    // mat.drawRectangle(rectOuterPlaceLabel, blue, thickness);
    // eslint-disable-next-line no-console
    console.log({
      placeName: placeName.countNonZero(),
      frame: vCap.getFrame()
    });
  }
  return _mat;
}
