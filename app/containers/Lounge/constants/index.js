import cv from 'opencv4nodejs';

export const qualityRatio = 1;
export const rx = 1 / qualityRatio;
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
export const color = {
  green,
  blue,
  red,
  purple,
  cyan,
  yellow,
  black,
  white
};

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

export const rows = 1440;
export const cols = 1920;
export const threshPercentDiff = 5;
export const threshPlacePercentDiff = 5;
export const threshTitlePercentDiff = 5;
export const blackThreshold = 3;
export const whiteThreshold = 252;
export const fadeThreshold = 3;
export const actorThreshold = 500;

export const gapConst = 10;

export const placeLabelThreshold = {
  blue: [80, 159],
  green: [40, 111],
  red: [170, 255],
  hue: [164, 180],
  sat: [100, 255],
  val: [100, 255]
};

export const placeCenterThreshold = {
  gray: [0, 144]
};

export const nameLabelCrop = {
  innerX: [Math.round(115 * rx), Math.round(547 * rx)],
  innerY: [Math.round(1116 * rx), Math.round(1177 * rx)],
  outerX: [Math.round(78 * rx), Math.round(620 * rx)],
  outerY: [Math.round(1104 * rx), Math.round(1190 * rx)]
};
export const subtitleCrop = {
  rectX: [Math.round(100 * rx), Math.round(1800 * rx)],
  rectY: [Math.round(1200 * rx), Math.round(1400 * rx)]
};
export const placeLabelCrop = {
  innerX: [Math.round(447 * rx), Math.round(1464 * rx)],
  innerY: [Math.round(695 * rx), Math.round(745 * rx)],
  outerX: [Math.round(323 * rx), Math.round(1592 * rx)],
  outerY: [Math.round(649 * rx), Math.round(795 * rx)]
};
export const titleLabelCrop = {
  outerX: [Math.round(20 * rx), Math.round(90 * rx)],
  outerY: [Math.round(20 * rx), Math.round(90 * rx)],
  innerX: [Math.round(385 * rx), Math.round(1465 * rx)],
  innerY: [Math.round(690 * rx), Math.round(750 * rx)]
};
export const titleLineCrop = {
  rectX: [Math.round(75 * rx), Math.round(1920 * rx)],
  rectY: [Math.round(80 * rx), Math.round(85 * rx)]
};
export const titleHeader = {
  x: Math.round(75 * rx),
  y: Math.round(25 * rx),
  height: Math.round(60 * rx)
};

export const meanSmooth = 5;
export const meanLength = 1000;
export const startVCap = 0;
export const limitVCap = 10000;
export const chunkCount = 60;
