import cv from 'opencv4nodejs';

export const maxWidth = (960 / 2) * 2;
export const maxHeight = (720 / 2) * 2;
export const maxMinDist = 15000;
export const green = new cv.Vec(0, 255, 0);
export const blue = new cv.Vec(255, 0, 0);
export const red = new cv.Vec(0, 0, 255);
export const purple = new cv.Vec(255, 0, 255);
export const cyan = new cv.Vec(255, 255, 0);
export const yellow = new cv.Vec(0, 255, 255);
export const black = new cv.Vec(0, 0, 0);
export const white = new cv.Vec(255, 255, 255);

export const nameLabelThreshold = {
  blue: [87, 185],
  green: [41, 126],
  red: [229, 255],
  hue: [145, 181],
  sat: [123, 255],
  val: [224, 255]
};

export const subtitleThreshold = {
  blue: [64, 164],
  green: [64, 164],
  red: [64, 164]
};

export const nameLabelCrop = {
  innerX: [115, 547],
  innerY: [1116, 1177],
  outerX: [78, 620],
  outerY: [1104, 1190]
};

export const subtitleCrop = {
  rectX: [100, 1800],
  rectY: [1200, 1400]
};

export const rows = 1440;
export const cols = 1920;
export const threshPercentDiff = 2;
