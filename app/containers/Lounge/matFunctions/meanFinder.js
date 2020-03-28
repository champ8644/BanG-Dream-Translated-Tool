import meanInstance from './meanClass';

export default function meanFinder(mat, vCap) {
  const { x, y, w } = mat.rescale(1 / 2).mean();
  const mean = (x + y + w) / 3;
  const frame = vCap.frame();
  meanInstance.push(frame, mean);
  meanInstance.isFadingToBlack(frame);
  return mat;
}
