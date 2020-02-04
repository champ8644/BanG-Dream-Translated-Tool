import cv from 'opencv4nodejs';
import { nameLabelCrop } from '../constants';
/* eslint-disable */
const mask = cv.imread('CaptureNameLabel.png');
const maskBRG = cv.imread('CaptureNameLabelBGR.png');

let c = 0;

function isZero(vec) {
  return vec.x === 0 && vec.y === 0 && vec.z === 0;
}

function isEqual(vec1, vec2) {
  if (!c) {
    console.log('vec', vec1, vec2);
    console.log({ x: vec1.x, y: vec1.y, z: vec1.z });
    console.log({ x: vec2.x, y: vec2.y, z: vec2.z });
    c = 2;
  }
  return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
}

function testLoop(mat) {
  const { outerX, outerY } = nameLabelCrop;
  for (let i = outerX[0]; i < outerX[1]; i++) {
    for (let j = outerY[0]; j < outerY[1]; j++) {
      const pixelAtMask = mask.at(j, i);
      if (!isZero(pixelAtMask)) {
        const pixelAtMat = mat.at(j, i);
        if (!isEqual(pixelAtMat, pixelAtMask)) return false;
      }
    }
  }
  return true;
}

export default function labelCheck(mat) {
  const outMat = mat.bitwiseXor(mask);

  return outMat;
}
