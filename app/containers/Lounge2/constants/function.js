export function formatNumber(_x) {
  const x = parseFloat(_x);
  if (isNaN(x)) return _x;
  if (x % 1)
    return x
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
