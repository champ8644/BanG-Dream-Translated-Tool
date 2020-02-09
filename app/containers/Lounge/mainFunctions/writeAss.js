import assTemplate from '../constants/assTemplate';
import fs from 'fs';

function toTs(ms) {
  const h = Math.floor(ms / 60 / 60 / 1000);
  let mm = Math.floor(ms / 60 / 1000) % 60;
  mm = mm.toString().padStart(2, '0');
  let ss = (Math.round(ms / 10) % 6000) / 100;
  ss = ss.toFixed(2).padStart(5, '0');
  return `${h}:${mm}:${ss}`;
}

function writeCredit(ms) {
  return `Dialogue: 0,0:00:00.00,${toTs(
    ms
  )},Credit,,0,0,0,,Facebook.com/Nep4A4Life\n`;
}

export default function writeAss(data, vCap) {
  const stream = fs.createWriteStream(
    `${vCap.path.substr(0, vCap.path.lastIndexOf('.'))}.ass`,
    {
      encoding: 'utf8'
    }
  );
  stream.once('open', () => {
    stream.write(assTemplate(vCap.path));
    stream.write(writeCredit((vCap.length * 1000) / vCap.FPS));
    stream.end();
  });
}
