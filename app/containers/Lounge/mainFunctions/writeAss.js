import { correctPlaceFadeBlack, skipNonIntersectWhiteLine } from '../constants';

import assTemplate from '../constants/assTemplate';
import { enabledSnapToFade } from '../constants/config';
import fs from 'fs';

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
  return Math.floor(ms * 100) / 100;
}

function writeCredit(frame) {
  return `Dialogue: 0,0:00:00.00,${timestamp(
    frame
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

function writeSubtitle({ begin, end, actor = '', content = '' }) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(
    end
  )},ข้อความ,${actor},0,0,0,,${content}
  `;
}

function writeSubtitleShake({
  begin,
  end,
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
  end,
  fadeIn,
  fadeOut,
  leftCompensate,
  rightCompensate
}) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(end)},ฉากขาว,${timeMs(
    fadeIn - begin
  )};${timeMs(end - fadeOut)};${leftCompensate ? 1 : 0};${
    rightCompensate ? 1 : 0
  },0,0,0,,
  `;
}

function writeBlack({
  begin,
  end,
  fadeIn,
  fadeOut,
  leftCompensate,
  rightCompensate
}) {
  return `Dialogue: 0,${timestamp(begin)},${timestamp(end)},ฉากดำ,${timeMs(
    fadeIn - begin
  )};${timeMs(end - fadeOut)};${leftCompensate ? 1 : 0};${
    rightCompensate ? 1 : 0
  },0,0,0,,
  `;
}

function embrace(arr) {
  return `{${arr.join()}}`;
}

function writeShake({ arr, begin, end }) {
  return `Comment: 0,${timestamp(begin)},${timestamp(
    end
  )},ข้อความสั่น,,0,0,0,code once,_G.table.insert(shake,${embrace(
    arr.map(itemitem =>
      embrace([
        `t=${timeMs(itemitem.frame)}`,
        `x=${itemitem.x}`,
        `y=${itemitem.y}`
      ])
    )
  )})
  `;
}

function bakeShake(item) {
  const { begin, end } = item;
  // const min = item.shake[0].frame;
  let max = -9999;
  const shakeTree = {};
  let valid = false;
  let prev = { x: -9999, y: -9999 };
  item.shake.forEach(it => {
    if (prev.x !== it.x || prev.y !== it.y) {
      shakeTree[it.frame] = { x: it.x, y: it.y };
      if (it.x !== 0 || it.y !== 0) valid = true;
      prev = it;
      if (max < it.frame) max = it.frame;
    }
  });
  if (!valid) return null;
  // for (let i = min + 1; i <= max + 1; i++)
  //   if (!shakeTree[i]) shakeTree[i] = { x: 0, y: 0 };
  shakeTree[0] = { x: 0, y: 0 };
  if (max < end && !(shakeTree[max].x === 0 && shakeTree[max].y === 0))
    shakeTree[max + 1] = { x: 0, y: 0 };
  shakeTree[end - begin] = { x: 0, y: 0 };
  const shakeOut = Object.keys(shakeTree).map(key => ({
    frame: Number(key),
    ...shakeTree[key]
  }));
  return { arr: shakeOut, begin, end };
}

function statusOverlap(a, b) {
  if (a.begin < b.begin) {
    if (a.end < b.begin) return -3;
    if (a.end < b.end) return -2;
    return -1;
  }
  if (a.end < b.end) return 1;
  if (a.begin < b.end) return 2;
  return 3;
}

function isIntersect(a, b) {
  if (b === undefined) return a > -3 && a < 3;
  const status = statusOverlap(a, b);
  return status > -3 && status < 3;
}

/* eslint-disable no-param-reassign */
export default function writeAss({ data, nameActor, info }) {
  const { path, limitVCap, FPS } = info;
  toMs = frame => (frame * 1000) / FPS;
  // eslint-disable-next-line no-console
  console.log('data: ', data);
  const stream = fs.createWriteStream(
    `${path.substr(0, path.lastIndexOf('.'))}.ass`,
    {
      encoding: 'utf8'
    }
  );
  // eslint-disable-next-line no-console
  stream.on('finish', () => console.log('Finish writing file!!'));

  const outData = [];
  const shakeArr = [];
  const keys = Object.keys(data);

  keys.forEach(type => {
    if (data[type]) {
      if (data[type].length > 0) {
        const item = data[type][data[type].length - 1];
        if (!item.end) item.end = limitVCap;
      }
    }
  });

  [('place', 'title', 'name')].forEach(type => {
    for (let i = 0; i < data[type].length; i++) {
      const item = data[type][i];
      ['fadeB', 'fadeW'].forEach(typeF => {
        for (let j = 0; j < data[typeF].length; j++) {
          const jtem = data[typeF][j];
          const status = statusOverlap(item, jtem);
          if (isIntersect(status)) {
            if (type === 'name') {
              if (status === -2 || status === -1) jtem.leftCompensate = true;
              if (status === -1 || status === 2) jtem.rightCompensate = true;
            }
            if (!jtem.overlapped) jtem.overlapped = {};
            if (!jtem.overlapped[type]) jtem.overlapped[type] = [];
            jtem.overlapped[type].push({ index: i, status });
          }
        }
      });
    }
  });

  ['fadeB', 'fadeW'].forEach(typeF => {
    data[typeF].forEach(item => {
      if (item.overlapped) {
        const { place, name } = item.overlapped;
        if (place) {
          place.forEach(ptem => {
            if (ptem.status === 2)
              data.place[ptem.index].begin -= correctPlaceFadeBlack;
          });
        }
        if (enabledSnapToFade) {
          if (name) {
            name.forEach(ntem => {
              if (ntem.status === -2) data.name[ntem.index].end = item.fadeIn;
              else if (ntem.status === 2)
                data.name[ntem.index].begin = item.fadeOut;
            });
            let prevNtem = { index: -999 };
            name.forEach(ntem => {
              if (prevNtem.index === ntem.index - 1) {
                if (prevNtem.status === 2 && ntem.status === -2) {
                  if (
                    data.name[prevNtem.index].actor ===
                    data.name[ntem.index].actor
                  ) {
                    data.name[prevNtem.index].end = data.name[ntem.index].end;
                    data.name[ntem.index].skip = true;
                  }
                }
              }
              prevNtem = ntem;
            });
          }
        }
      } else if (skipNonIntersectWhiteLine) item.skip = true;
    });
  });

  keys.forEach(type => {
    for (let j = 0; j < data[type].length; j++) {
      if (!data[type][j].skip) {
        if (type === 'name' && data[type][j].shake) {
          const baked = bakeShake(data[type][j]);
          if (baked) {
            shakeArr.push(baked);
            outData.push({
              type: 'shake',
              ...data[type][j],
              shakeUID: shakeArr.length,
              shake: baked
            });
          } else {
            outData.push({ type, ...data[type][j] });
          }
        } else outData.push({ type, ...data[type][j] });
      }
    }
  });

  outData.sort(
    (a, b) =>
      (a.type === 'fadeB' || a.type === 'fadeW') -
        (b.type === 'fadeB' || b.type === 'fadeW') || a.begin - b.begin
  );
  // eslint-disable-next-line no-console
  console.log('outData: ', outData);
  stream.once('open', () => {
    stream.write(assTemplate(path));
    shakeArr.forEach(item => stream.write(writeShake(item)));
    stream.write(writeCredit(limitVCap));
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
