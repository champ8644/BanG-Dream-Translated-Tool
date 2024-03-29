import cv from 'opencv4nodejs';

export const yOffset = { title: 0, place: -50, dialog: -160 };

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
  red,
  blue,
  purple,
  green,
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

export const starLabelEndColorThreshold = {
  blue: [87, 185],
  green: [41, 126],
  red: [229, 255],
  hue: [145, 181],
  sat: [123, 255],
  val: [200, 255]
};

export const subtitleThreshold = {
  blue: [0, 128],
  green: [0, 128],
  red: [0, 128]
};

export const rows = 1440;
export const cols = 1920;
export const skipDialogCountThreshold = 5000;
export const dialogThreshold = 200;
export const dialogDiffThreshold = 100;
export const dialogPartialDiffThreshold = 150;
export const starLabelEndThreshold = 0.6;
export const threshPercentDiff = 3;
export const threshStarMatching = 0.95;
export const threshPlacePercentDiff = 5;
export const threshTitlePercentDiff = 5;
export const threshSubSubtitle = 20;
export const blackThreshold = 3;
export const whiteThreshold = 252;
export const fadeThreshold = 2;
export const actorThreshold = 750;
export const blackMaxThreshold = 8;
export const whiteMinThreshold = 255 - blackMaxThreshold;

export const maxMinROI = {
  rectX: [Math.round(10 * rx), Math.round(1910 * rx)],
  rectY: [Math.round(10 * rx), Math.round(1280 * rx)]
};

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
  innerX: [Math.round(100 * rx), Math.round(520 * rx)],
  innerY: [
    Math.round(1116 * rx) + yOffset.dialog,
    Math.round(1180 * rx) + yOffset.dialog
  ],
  outerX: [Math.round(70 * rx), Math.round(610 * rx)],
  outerY: [
    Math.round(1104 * rx) + yOffset.dialog,
    Math.round(1190 * rx) + yOffset.dialog
  ]
};
export const starCrop = {
  rectX: [Math.round(523 * rx), Math.round(583 * rx)],
  rectY: [
    Math.round(1107 * rx) + yOffset.dialog,
    Math.round(1189 * rx) + yOffset.dialog
  ]
};
export const nameLabelStarCrop = {
  rectX: [Math.round(112 * rx), Math.round(597 * rx)],
  rectY: [
    Math.round(1110 * rx) + yOffset.dialog,
    Math.round(1185 * rx) + yOffset.dialog
  ]
};
const diffShaken = 40;
export const nameLabelStarROI = {
  rectX: [
    Math.round((112 - diffShaken) * rx),
    Math.round((597 + diffShaken) * rx)
  ],
  rectY: [
    Math.round((1110 - diffShaken) * rx) + yOffset.dialog,
    Math.round((1185 + diffShaken) * rx) + yOffset.dialog
  ]
};
export const starROI = {
  rectX: [
    Math.round((555 - diffShaken) * rx),
    Math.round((616 + diffShaken) * rx)
  ],
  rectY: [
    Math.round((900 - diffShaken) * rx) + yOffset.dialog,
    Math.round((1400 + diffShaken) * rx) + yOffset.dialog
  ]
};

export const starLabelEndROI = {
  roiX: [
    Math.round((555 - diffShaken) * rx),
    Math.round((619 + diffShaken) * rx)
  ],
  roiY: [
    Math.round((1105 - diffShaken) * rx) + yOffset.dialog,
    Math.round((1189 + diffShaken) * rx) + yOffset.dialog
  ]
};
export const starLabelEndCrop = {
  rectX: [Math.round(555 * rx), Math.round(619 * rx)],
  rectY: [
    Math.round(1105 * rx) + yOffset.dialog,
    Math.round(1189 * rx) + yOffset.dialog
  ]
};
export const subtitleCrop = {
  rectX: [Math.round(100 * rx), Math.round(1800 * rx)],
  rectY: [
    Math.round(1210 * rx) + yOffset.dialog,
    Math.round(1390 * rx) + yOffset.dialog
  ]
};
export const subtitlePartialCrop = {
  rectX: [Math.round(120 * rx), Math.round(1000 * rx)],
  rectY: [
    Math.round(1210 * rx) + yOffset.dialog,
    Math.round(1270 * rx) + yOffset.dialog
  ]
};
export const subtitleFifthCrop = {
  rectX: [Math.round(340 * rx), Math.round(440 * rx)],
  rectY: [
    Math.round(1210 * rx) + yOffset.dialog,
    Math.round(1270 * rx) + yOffset.dialog
  ]
};
export const fifthThreshold = 150;
export const placeLabelCrop = {
  innerX: [Math.round(447 * rx), Math.round(1464 * rx)],
  innerY: [
    Math.round(695 * rx) + yOffset.place,
    Math.round(745 * rx) + yOffset.place
  ],
  outerX: [Math.round(323 * rx), Math.round(1592 * rx)],
  outerY: [
    Math.round(649 * rx) + yOffset.place,
    Math.round(795 * rx) + yOffset.place
  ]
};
export const titleLabelCrop = {
  outerX: [Math.round(20 * rx), Math.round(90 * rx)],
  outerY: [
    Math.round(20 * rx) + yOffset.title,
    Math.round(90 * rx) + yOffset.title
  ],
  innerX: [Math.round(385 * rx), Math.round(1465 * rx)],
  innerY: [
    Math.round(690 * rx) + yOffset.title,
    Math.round(750 * rx) + yOffset.title
  ]
};
export const titleLineCrop = {
  rectX: [Math.round(75 * rx), Math.round(1920 * rx)],
  rectY: [
    Math.round(80 * rx) + yOffset.title,
    Math.round(85 * rx) + yOffset.title
  ]
};
export const titleHeader = {
  x: Math.round(75 * rx),
  y: Math.round(25 * rx) + yOffset.title,
  height: Math.round(60 * rx)
};

export const correctPlaceFadeBlack = 6;
export const thickness = 2;

export const intersectCompensate = 30;
export const NUM_MAX_PROCESS = 8;

export const videoListRatio = 1 / 6;
export const videoListMaxWidth = Math.round(1920 * videoListRatio);
export const videoListMaxHeight = Math.round(1440 * videoListRatio);

export const skipNonIntersectWhiteLine = false;

export const RESEARCH_SKIP = 150;

export const loungeBackgroundColorThreshold = 220;

export const limitLoungeMoving = { x: 118, y: 68, c: 118 };

export const eventLoungeThreshold = 240;
export const FindingEventType = 3;
