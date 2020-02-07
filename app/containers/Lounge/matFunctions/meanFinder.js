// import cv from 'opencv4nodejs';

export default function meanFinder(mat) {
  const { x, y, w } = mat.mean();
  const mean = (x + y + w) / 3;
  // eslint-disable-next-line no-console
  console.log('mean: ', mean);
  return mat;
}
