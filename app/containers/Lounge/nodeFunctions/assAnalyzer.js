import { promises as fs } from 'fs';
import { remote } from 'electron';
import { showTime } from '../constants/function';

const { dialog } = remote;

export default async function assAnalyzer() {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'Aegisub files',
        extensions: ['ass']
      }
    ]
  });
  if (canceled) return;
  fs.readFile(
    filePaths[0],
    {
      encoding: 'utf8',
      flag: 'r'
    },
    dataAnalyzer
  );
}

function timeify(hr, min, sec, cs) {
  let time = 0;
  time += Number(hr);
  time *= 60;
  time += Number(min);
  time *= 60;
  time += Number(sec);
  time *= 100;
  time += Number(cs);
  time *= 10;
  return time;
}

function dataAnalyzer(err, data) {
  if (err) console.error(err);
  const split = data.split('[BanG Dream Translated Tool Info]');
  let assJSON = null;
  if (split.length > 1) assJSON = JSON.parse(split[1]);
  // eslint-disable-next-line no-console
  console.log(assJSON);
  const lines = data.split('\n');
  const regSkip = new RegExp(
    'Dialogue: 0,([0-9]):([0-9]{2}):([0-9]{2}).([0-9]{2}),([0-9]):([0-9]{2}):([0-9]{2}).([0-9]{2}),skip,,0,0,0,,',
    'i'
  );
  const skipLines = lines.reduce((state, line) => {
    const res = regSkip.exec(line);
    if (res) {
      const [, bhr, bmin, bsec, bcs, ehr, emin, esec, ecs] = res;
      const begin = timeify(bhr, bmin, bsec, bcs);
      const end = timeify(ehr, emin, esec, ecs);
      state.push(end - begin);
    }
    return state;
  }, []);
  // eslint-disable-next-line no-console
  console.log('skipLines: ', skipLines);
  const regEmpty = new RegExp(
    'Dialogue: 0,([0-9]):([0-9]{2}):([0-9]{2}).([0-9]{2}),([0-9]):([0-9]{2}):([0-9]{2}).([0-9]{2}),empty,,0,0,0,,',
    'i'
  );
  const emptyLines = lines.reduce((state, line) => {
    const res = regEmpty.exec(line);
    if (res) {
      const [, bhr, bmin, bsec, bcs, ehr, emin, esec, ecs] = res;
      const begin = timeify(bhr, bmin, bsec, bcs);
      const end = timeify(ehr, emin, esec, ecs);
      state.push(end - begin);
    }
    return state;
  }, []);
  // eslint-disable-next-line no-console
  console.log('emptyLines: ', emptyLines);
  const sum = skipLines.reduce((state, next) => state + next, 0);
  const mean = sum / skipLines.length;
  // eslint-disable-next-line no-console
  console.log({ mean, sum: showTime(sum) });
  const output = ['skip,empty'];
  for (let i = 0; i < skipLines.length || i < emptyLines.length; i++) {
    output.push(
      `${i < skipLines.length ? skipLines[i] : ''},${
        i < emptyLines.length ? emptyLines[i] : ''
      }`
    );
  }
  fs.writeFile('./test/export.csv', output.join('\n'), {
    encoding: 'utf8'
  });
}
