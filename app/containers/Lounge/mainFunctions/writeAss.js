import assTemplate from '../constants/assTemplate';
import fs from 'fs';
import { limitVCap } from '../constants';

function timestamp(ms) {
  const h = Math.floor(ms / 60 / 60 / 1000);
  let mm = Math.floor(ms / 60 / 1000) % 60;
  mm = mm.toString().padStart(2, '0');
  let ss = (Math.floor(ms / 10) % 6000) / 100;
  ss = ss.toFixed(2).padStart(5, '0');
  return `${h}:${mm}:${ss}`;
}

function writeCredit(ms) {
  return `Dialogue: 0,0:00:00.00,${timestamp(
    ms
  )},Credit,,0,0,0,,Facebook.com/Nep4A4Life
  `;
}

function writePlace({ begin, end, content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ชื่อสถานที่,93,0,0,0,,${content}
  `;
}

function writeTitle({ begin, end, width, content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ชื่อตอน,${width},0,0,0,,${content}
  `;
}

function writeSubtitle({ begin, end, actor = 'จิซาโตะ', content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ข้อความ,${actor},0,0,0,,${content}
  `;
}

function writeNameActor({ ms, uid }) {
  return `Comment: 0,${timestamp(ms)},${timestamp(
    ms + 1000
  )},ข้อความ,,0,0,0,code once,name[${uid}] = ""
  `;
}

export default function writeAss(data, nameActor, vCap) {
  // console.log('data: ', data);
  const stream = fs.createWriteStream(
    `${vCap.path.substr(0, vCap.path.lastIndexOf('.'))}.ass`,
    {
      encoding: 'utf8'
    }
  );
  // eslint-disable-next-line no-console
  stream.on('finish', () => console.log('Finish writing file!!'));

  const outData = [];
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const type = keys[i];
    outData[type] = [];
    if (data[type].length > 0) {
      if (!data[type][data[type].length - 1].off) {
        data[type].push({
          frame: limitVCap,
          ms: (limitVCap * 1000) / vCap.FPS,
          off: true
        });
      }
    }
  }

  for (let i = 0; i < keys.length; i++) {
    const type = keys[i];
    for (let j = 0; j < data[type].length; j++) {
      if (!data[type][j].off) {
        outData.push({
          type,
          begin: data[type][j].ms,
          end: data[type][j + 1].ms,
          ...data[type][j].payload
        });
      }
    }
  }

  outData.sort((a, b) => a.begin - b.begin);

  stream.once('open', () => {
    stream.write(assTemplate(vCap.path));
    nameActor.forEach(item => stream.write(writeNameActor(item)));
    stream.write(writeCredit((vCap.length * 1000) / vCap.FPS));
    outData.forEach(item => {
      switch (item.type) {
        case 'name':
          stream.write(writeSubtitle(item));
          break;
        case 'place':
          stream.write(writePlace(item));
          break;
        case 'title':
          stream.write(writeTitle(item));
          break;
        default:
      }
    });
    stream.end();
  });
}
