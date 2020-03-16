export const radioObj = [
  'none',
  // 'scopeFinder',
  // 'GRAYFinder',
  // 'HSVFinder',
  // 'meanFinder',
  'placeLabelGenerator',
  'placeLabelTemplater',
  'nameLabelGenerator',
  'nameLabelTemplater',
  'titleLabelGenerator',
  'titleLabelTemplater',
  'starMatching'
];

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

export const startVCap = 400;
export const endVCap = 1200;
export const meanSmooth = 5;
export const meanLength = 1000;
export const chunkCount = 60;
