import VideoCapture from '../VideoCapture';
import { autoOpenFileName } from '../constants/config';
import { promises as fs } from 'fs';

function runTest(vCap, goal, skip, timeOut) {
  for (let i = 0; i < goal; i += skip) {
    if (new Date().getTime() > timeOut) return false;
    vCap.getMat(i);
  }
  return true;
}

function tick(vCap, callback) {
  vCap.setFrame(0);
  const beginTime = new Date().getTime();
  const finished = callback(vCap, beginTime + 20000);
  if (!finished) return 'timeout';
  return new Date().getTime() - beginTime;
}

export default function speedTester() {
  const vCap = new VideoCapture({ path: autoOpenFileName });
  const goal = 1000;
  const testArr = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    120,
    140,
    160,
    180,
    200,
    250,
    300,
    400,
    500,
    750,
    1000
  ];
  const res = testArr
    .sort((a, b) => a - b)
    .map(skip => {
      const tic = tick(vCap, (_vCap, timeOut) =>
        runTest(_vCap, goal, skip, timeOut)
      );
      // eslint-disable-next-line no-console
      console.log('start test ', { goal, skip, tic });
      return { skip, time: tic };
    });
  // eslint-disable-next-line no-console
  console.log(res);
  const output = ['skip,time'];
  res.forEach(each => output.push(`${each.skip},${each.time}`));
  fs.writeFile('./test/timeTest.csv', output.join('\n'), {
    encoding: 'utf8'
  });
}
