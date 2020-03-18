import path from 'path';

/* eslint-disable global-require */

const matFunctions = {};

const fileNames = [
  'BGRFinder.js',
  'contourFinder.js',
  'GRAYFinder.js',
  'HSVFinder.js',
  'index.js',
  'meanClass.js',
  'meanFinder.js',
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
  'titleLineWidthFinder.js'
];

fileNames.forEach(file => {
  const { name } = path.parse(file);
  if (file !== 'index.js') matFunctions[name] = require(`./${name}`).default;
});

export default matFunctions;
