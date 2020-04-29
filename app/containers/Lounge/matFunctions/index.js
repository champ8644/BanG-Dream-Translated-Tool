import { fileNames } from '../constants/config';
import path from 'path';

/* eslint-disable global-require */

const matFunctions = {};

fileNames.forEach(file => {
  const { name } = path.parse(file);
  if (file !== 'index.js') matFunctions[name] = require(`./${name}`).default;
});

export default matFunctions;
