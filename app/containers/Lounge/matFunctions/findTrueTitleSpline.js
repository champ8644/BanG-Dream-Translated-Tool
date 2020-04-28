// import { blue, placeLabelCrop, placeLabelThreshold, red } from '../constants';

import { color, placeLabelCrop } from '../constants';

import cv from 'opencv4nodejs';
import makePlaceLabel from '../mainFunctions/makePlaceLabel';
import { paintMat } from '../utils/utilityCv';
import { thresholdOtsu } from '../utils/thresholdCv';

const { outerY } = placeLabelCrop;
const rectOuterPlaceLabel = new cv.Rect(
  0,
  outerY[0],
  1920,
  outerY[1] - outerY[0]
);
// const rectPlaceLabel = new cv.Rect(
//   innerX[0],
//   innerY[0],
//   innerX[1] - innerX[0],
//   innerY[1] - innerY[0]
// );

function findingContour(frame) {
  const contours = frame.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  const mat = frame.cvtColor(cv.COLOR_GRAY2BGR);
  contours.sort((a, b) => a.area - b.area);
  // eslint-disable-next-line no-console
  // console.log('contours: ', contours);
  const outObj = [];
  contours.forEach(item => {
    if (item.area > 50000 && item.area < 150000) {
      const peri = item.arcLength(true);
      const approx = item.approxPolyDP(0.02 * peri, true);
      // if (approx.length === 4) {
      // const approxContour = new cv.Contour(approx);
      // if (isFinalContour(approxContour)) {
      const finalRect = item.boundingRect();
      outObj.push(item);
      mat.drawContours([approx], -1, color.blue, 1);
      mat.drawContours([item.getPoints()], -1, color.green, 1);
      mat.drawRectangle(item.boundingRect(), color.green, 1);
      mat.drawRectangle(finalRect, color.red, 3);
      mat.drawCircle(
        new cv.Point(
          finalRect.x + finalRect.width / 2,
          finalRect.y + finalRect.height / 2
        ),
        5,
        color.red,
        10,
        cv.FILLED
      );
    }
  });

  // });
  // console.log('contour: ', outObj);
  return mat;
}

export default function placeLabelGenerator(mat, vCap) {
  // const { val, sat, hue } = placeLabelThreshold;
  // const lowerColorBounds = new cv.Vec(hue[0], sat[0], val[0]);
  // const upperColorBounds = new cv.Vec(hue[1], sat[1], val[1]);
  const { percentDiff, status, placeName } = makePlaceLabel(mat);
  // const chans = mat.getRegion(rectOuterPlaceLabel).splitChannels();
  // const _mat = thresholdOtsu(chan[0].cvtColor(cv.COLOR_BGR));
  const thresh = thresholdOtsu(mat.getRegion(rectOuterPlaceLabel));
  paintMat(mat, findingContour(thresh), rectOuterPlaceLabel, color.black);
  // .cvtColor(cv.COLOR_BGR2HSV)
  // .inRange(lowerColorBounds, upperColorBounds);
  // findingContour(_mat);
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
  return mat;
}
