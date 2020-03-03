import assTemplate from '../constants/assTemplate';
import fs from 'fs';
import { limitVCap } from '../constants';

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

function timeMs(frame) {
  const ms = toMs(frame);
  return Math.round(ms * 1000) / 1000;
}

function writeCredit(frame) {
  return `Dialogue: 0,0:00:00.00,${timestamp(
    frame
  )},Credit,,0,0,0,,Facebook.com/Nep4A4Life
  `;
}

function writePlace({ begin, end = limitVCap, content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ชื่อสถานที่,93,0,0,0,,${content}
  `;
}

function writeTitle({ begin, end = limitVCap, width, content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ชื่อตอน,${width},0,0,0,,${content}
  `;
}

function writeSubtitle({ begin, end = limitVCap, actor = '', content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ข้อความ,${actor},0,0,0,,${content}
  `;
}

function writeSubtitleShake({
  begin,
  end = limitVCap,
  actor = '',
  shakeUID,
  content = ''
}) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ข้อความสั่น,${shakeUID};${actor},0,0,0,,${content}
  `;
}
function writeNameActor({ frame, uid }) {
  return `Comment: 0,${timestamp(frame)},${timestamp(
    frame
  )},ข้อความ,,0,0,0,code once,name[${uid}] = ""
  `;
}

function writeWhite({
  begin,
  end = limitVCap,
  fadeIn = limitVCap,
  fadeOut = limitVCap
}) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(end)},ฉากขาว,${timeMs(
    fadeIn - begin
  )};${timeMs(end - fadeOut)},0,0,0,,
  `;
}

function writeBlack({
  begin,
  end = limitVCap,
  fadeIn = limitVCap,
  fadeOut = limitVCap
}) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(end)},ฉากดำ,${timeMs(
    fadeIn - begin
  )};${timeMs(end - fadeOut)},0,0,0,,
  `;
}

function embrace(arr) {
  return `{${arr.join()}}`;
}

function writeShake(item) {
  return `Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,code once,_G.table.insert(shake,${embrace(
    item.map(itemitem =>
      embrace([
        `t=${timeMs(itemitem.frame)}`,
        `x=${timeMs(itemitem.x)}`,
        `y=${timeMs(itemitem.y)}`
      ])
    )
  )})
  `;
}

export default function writeAss(data, nameActor, vCap) {
  toMs = frame => (frame * 1000) / vCap.FPS;
  // eslint-disable-next-line no-console
  console.log('data: ', data);
  const stream = fs.createWriteStream(
    `${vCap.path.substr(0, vCap.path.lastIndexOf('.'))}.ass`,
    {
      encoding: 'utf8'
    }
  );
  // eslint-disable-next-line no-console
  stream.on('finish', () => console.log('Finish writing file!!'));

  const outData = [];
  const shakeArr = [];
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const type = keys[i];
    for (let j = 0; j < data[type].length; j++) {
      if (type === 'name' && data[type][j].shake) {
        outData.push({
          type: 'shake',
          ...data[type][j],
          shakeUID: shakeArr.length
        });
        shakeArr.push(data[type][j].shake);
      } else outData.push({ type, ...data[type][j] });
    }
  }
  outData.sort((a, b) => a.begin - b.begin);
  // eslint-disable-next-line no-console
  console.log('outData: ', outData);
  stream.once('open', () => {
    stream.write(assTemplate(vCap.path));
    shakeArr.forEach(item => stream.write(writeShake(item)));
    stream.write(writeCredit(vCap.length));
    nameActor.forEach(item => stream.write(writeNameActor(item)));
    outData.forEach(item => {
      switch (item.type) {
        case 'name':
          stream.write(writeSubtitle(item));
          break;
        case 'shake':
          stream.write(writeSubtitleShake(item));
          break;
        case 'place':
          stream.write(writePlace(item));
          break;
        case 'title':
          stream.write(writeTitle(item));
          break;
        case 'fadeB':
          stream.write(writeBlack(item));
          break;
        case 'fadeW':
          stream.write(writeWhite(item));
          break;
        default:
      }
    });
    stream.end();
  });
}
