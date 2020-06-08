import fs from 'fs';
import moment from 'moment';

let toMs;

function timestamp(frame) {
  const ms = toMs(frame);
  const h = Math.floor(ms / 60 / 60 / 1000);
  let mm = Math.floor(ms / 60 / 1000) % 60;
  mm = mm.toString().padStart(2, '0');
  let ss = (Math.floor(ms / 10) % 6000) / 100;
  ss = ss.toFixed(2).padStart(5, '0');
  return `${h}:${mm}:${ss}`;
}

// function timeMs(frame) {
//   const ms = toMs(frame);
//   return Math.floor(ms * 100) / 100;
// }

function writeCredit(frame) {
  return `Dialogue: 0,0:00:00.00,${timestamp(
    frame
  )},Credit,,0,0,0,,Facebook.com/Nep4A4Life
`;
}

function writeText({ begin, end, uid }) {
  return `Comment: 0,${timestamp(begin)},${timestamp(
    end
  )},Text,${uid},0,0,0,karaoke,
`;
}

function writeShake({ shake, begin, end }) {
  return `Comment: 0,${timestamp(begin)},${timestamp(
    end
  )},Text,,0,0,0,code once,${shake}
`;
}

function writeTemplateLine() {
  return `Dialogue: 0,0:00:00.00,0:00:00.00,Default,▼TEMPLATE LINES▼,0,0,0,,
`;
}

/* eslint-disable no-param-reassign */
export default function writeAss({ data, vCap }) {
  const { path, FPS, msLength } = vCap;
  toMs = frame => (frame * 1000) / FPS;

  const stream = fs.createWriteStream(
    `${path.substr(0, path.lastIndexOf('.'))} [${moment().format(
      'YYYY-MM-DD_HH-mm'
    )}].ass`,
    {
      encoding: 'utf8'
    }
  );
  // eslint-disable-next-line no-console
  stream.on('finish', () => console.log('Finish writing file!!'));
  stream.once('open', () => {
    data.forEach(item => stream.write(writeShake(item)));
    stream.write(writeCredit(msLength));
    stream.write(writeTemplateLine());
    data.forEach(item => stream.write(writeText(item)));
    stream.end();
  });
}
