import moment from 'moment';

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

export function showTime(_dur) {
  let dur;
  if (!moment.isDuration(_dur)) dur = moment.duration(_dur);
  else dur = _dur;
  const h = dur.hours();
  const mm = `${dur.minutes()}`.padStart(2, '0');
  const ss = `${dur.seconds()}`.padStart(2, '0');
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}
