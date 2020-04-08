import { IS_DEV } from '../../../constants/env';

export const radioObj = IS_DEV
  ? [
      'none',
      // 'maxFinder',
      'scopeFinder',
      'GRAYFinder',
      // 'BGRFinder',
      // 'HSVFinder',
      // 'placeLabelGenerator',
      // 'placeLabelTemplater',
      'nameLabelGenerator'
      // 'nameLabelTemplater'
      // 'titleLabelGenerator',
      // 'titleLabelTemplater',
      // 'starMatching'
    ]
  : [];

export const sliderObjSelector = {
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
  }
};

// export const startVCap = 48300;
// export const endVCap = 50000;
// export const startVCap = 88250;
// export const endVCap = 89150;
export const startFrameTest = 2200;
export const endFrameTest = 2400;
export const meanSmooth = 5;
export const meanLength = 1000;
export const chunkCount = 60;
