import { IS_DEV } from '../../../constants/env';

export const fileNames = [
  'BGRFinder.js',
  'contourFinder.js',
  'GRAYFinder.js',
  'HSVFinder.js',
  'index.js',
  'meanClass.js',
  'meanFinder.js',
  'maxFinder.js',
  'nameLabelGenerator.js',
  'nameLabelTemplater.js',
  'placeFinder.js',
  'placeLabelGenerator.js',
  'placeLabelTemplater.js',
  'placeNameFinder.js',
  'scopeFinder.js',
  'starMatching.js',
  'starTemplater.js',
  'subtitleFinder.js',
  'titleFinder.js',
  'titleLabelGenerator.js',
  'titleLabelTemplater.js',
  'titleLineWidthFinder.js',
  'fullDialogGenerator.js',
  'findTrueTitleSpline.js',
  'starLabelEndTemplater.js',
  'starLabelEndGenerator.js',
  'findTextBubble.js'
];

export const radioObj = IS_DEV
  ? [
      'none',
      'maxFinder',
      'scopeFinder',
      'GRAYFinder',
      'BGRFinder',
      'HSVFinder',
      'findTrueTitleSpline',
      'placeLabelGenerator',
      'starLabelEndGenerator',
      'nameLabelGenerator',
      'starMatching',
      'titleLabelGenerator',
      'fullDialogGenerator',
      'lounge',
      'findTextBubble'
    ]
  : [];

export const isAutoOpen = IS_DEV;
export const defaultOverlayMode = IS_DEV ? 'titleLabelGenerator' : 'none';
export const defaultVCapBeginFrame = IS_DEV ? 2000 : 0;
export const autoOpenFileName =
  'D:\\Downloads\\New folder (122)\\RPReplay_Final1679066312 [8B13FB6E]_2_175549.mp4';

export const showOtherBubble = true;

export const ws = {
  idle: 0,
  preconvert: 1,
  converting: 2,
  precancel: 3
};

// export const startVCap = 48300;
// export const endVCap = 50000;
// export const startVCap = 88250;
// export const endVCap = 89150;
// 112405
// export const defaultVCapBeginFrame = 115034;
// export const startFrameTest = 116230;
// export const startFrameTest = 106848;
// export const endFrameTest = 106969;
export const startFrameTest = 327000;
export const endFrameTest = 328000;
export const meanSmooth = 5;
export const meanLength = 1000;
export const chunkCount = 60;
export const updateThumbnailInterval = 10000;

export const enabledSnapToFade = false;

// export const sliderObjSelector = {
//   1342: sliderObjSelector1342,
//   1440: sliderObjSelector1440
// };

// export const defaultValueSlider = {
//   1342: defaultValueSlider1342,
//   1440: defaultValueSlider1440
// };

export const sliderObjSelector = {
  starMatching: {
    slider: [{ name: 'aperture', max: 99 }],
    commit: false
  },
  BGRFinder: {
    slider: [
      { name: 'red', max: 255 },
      { name: 'green', max: 255 },
      { name: 'blue', max: 255 }
    ],
    commit: false
  },
  HSVFinder: {
    slider: [
      { name: 'hue', max: 255 },
      { name: 'sat', max: 255 },
      { name: 'val', max: 255 }
    ],
    commit: false
  },
  GRAYFinder: {
    slider: [{ name: 'gray', max: 255 }],
    commit: false
  },
  scopeFinder: {
    slider: [
      { name: 'outerX', max: 1920 },
      { name: 'outerY', max: 1440 },
      { name: 'innerX', max: 1920 },
      { name: 'innerY', max: 1440 }
    ],
    commit: true
  },
  fullDialogGenerator: {
    slider: [{ name: 'thresh', max: 255 }, { name: 'blur', max: 30 }],
    commit: false
  },
  lounge: {
    slider: [{ name: 'approx', max: 100 }],
    commit: false
  }
};

export const defaultValueSlider = {
  red: [0, 255],
  green: [0, 255],
  blue: [0, 255],
  gray: [0, 255],
  hue: [0, 255],
  sat: [0, 255],
  val: [0, 255],
  outerX: [0, 1920],
  innerX: [0, 1920],
  outerY: [0, 1440],
  innerY: [0, 1440],
  thresh: [20, 255],
  aperture: 3,
  blur: 5,
  approx: 10
};
