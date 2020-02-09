export default function meanFinder(mat) {
  const { x, y, w } = mat.rescale(1 / 10).mean();
  const mean = (x + y + w) / 3;
  return mean;
}
