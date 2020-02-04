import { subtitleCrop, subtitleThreshold } from '../constants';

import cv from 'opencv4nodejs';

const { rectX, rectY } = subtitleCrop;
const subtitleRect = new cv.Rect(
  rectX[0],
  rectY[0],
  rectX[1] - rectX[0],
  rectY[1] - rectY[0]
);

export default function subtitleFinder(mat) {
  const { blue, green, red } = subtitleThreshold;
  const lowerColorBounds = new cv.Vec(blue[0], green[0], red[0]);
  const upperColorBounds = new cv.Vec(blue[1], green[1], red[1]);
  const matSubtitle = mat
    .inRange(lowerColorBounds, upperColorBounds)
    .cvtColor(cv.COLOR_GRAY2BGR);
  // if (
  //   (masked.cvtColor(cv.COLOR_BGR2GRAY).countNonZero() / countNameLabel) * 100 <
  //   threshPercentSame
  // ) {
  //   // const nameLabel = CaptureNameLabel.getRegion(rectNameLabel);
  // }
  // console.log(
  //   matSubtitle
  //     .getRegion(subtitleRect)
  //     .cvtColor(cv.COLOR_BGR2GRAY)
  //     .countNonZero()
  // );
  cv.imwrite(
    'CaptureSubtitle.png',
    matSubtitle.getRegion(subtitleRect).cvtColor(cv.COLOR_BGR2RGB)
  );
  return matSubtitle;
}
