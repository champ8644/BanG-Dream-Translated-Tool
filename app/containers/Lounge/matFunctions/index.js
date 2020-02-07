import fs from 'fs';
import path from 'path';

/* eslint-disable global-require */

const matFunctions = {};

fs.readdirSync(
  path.join(__dirname, './containers/Lounge/matFunctions/')
).forEach(file => {
  const { name } = path.parse(file);
  if (file !== 'index.js') matFunctions[name] = require(`./${name}`).default;
});

export default matFunctions;
