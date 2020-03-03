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

export function showMatWH(name, mat) {
  if (mat.width && mat.height) {
    // eslint-disable-next-line no-console
    console.log(name, {
      x: mat.x,
      y: mat.y,
      width: mat.width,
      height: mat.height
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(name, {
      rows: mat.rows,
      cols: mat.cols,
      channels: mat.channels
    });
  }
}
