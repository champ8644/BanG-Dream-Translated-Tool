import { chunkCount, limitVCap, meanLength, meanSmooth } from '../constants';

import findActorID from './findActorID';
import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import meanFinder from './meanFinder';
import writeAss from './writeAss';

const dialogThreshold = 10;

class Meaning {
  constructor() {
    this.data = [];
    this.div = meanSmooth;
    this.length = meanLength;
  }

  avg5(frame) {
    let sum = 0;
    for (let i = 1; i <= this.div; i++) {
      const prevFrame = (frame - i + this.length) % this.length;
      sum += this.data[prevFrame] || 0;
    }
    return sum / this.div;
  }

  push(frame, val) {
    this.data[frame % this.length] = val;
  }

  isFadingToBlack() {}

  isFadingFromBlack() {}

  isFadingToWhite() {}

  isFadingFromWhite() {}
}

let prevDialog = 999999999;
const meanClass = new Meaning();
const data = {
  name: [],
  place: [],
  title: [],
  fade: []
};
const refractory = {
  name: false,
  place: false,
  title: false
};

let isLoopValid;
function nonBlockingLoop(count = 1e9, chunksize, callback, finished) {
  let i = 0;
  isLoopValid = true;
  const beginTime = new Date().getTime();
  (function chunk() {
    const end = Math.min(i + chunksize, count);
    for (; i < end; i += 60) {
      callback.call(null, i);
    }
    // eslint-disable-next-line no-console
    console.log({
      frame: i,
      FPS: (i / (new Date().getTime() - beginTime)) * 1000
    });
    if (i < count && isLoopValid) {
      setTimeout(chunk, 0);
    } else {
      finished.call(null);
    }
  })();
}

export default function mainEvent(vCap) {
  const nameActor = [];
  nonBlockingLoop(
    limitVCap,
    chunkCount * 60,
    i => {
      const frame = i;
      const ms = (i * 1000) / vCap.FPS;
      // const frame = vCap.getFrame();
      // const ms = vCap.getFrame('ms');
      const mat = vCap.getMat(frame);
      if (mat.empty) {
        isLoopValid = false;
        return;
      }
      const placeObj = makePlaceLabel(mat, refractory.place);
      const titleObj = makeTitleLabel(mat, refractory.title);
      const nameObj = makeNameLabel(mat);
      meanClass.push(frame, meanFinder(mat));

      if (placeObj.status) {
        if (!refractory.place) {
          data.place.push({ ms, frame, payload: placeObj.payload });
          refractory.place = true;
        }
      } else if (refractory.place) {
        data.place.push({ ms, frame, off: true });
        refractory.place = false;
      }

      if (titleObj.status) {
        if (!refractory.title) {
          data.title.push({ ms, frame, payload: titleObj.payload });
          refractory.title = true;
        }
      } else if (refractory.title) {
        data.title.push({ ms, frame, off: true });
        refractory.title = false;
      }

      if (nameObj.status) {
        if (!refractory.name) {
          refractory.name = true;
          if (prevDialog - nameObj.dialog > dialogThreshold)
            vCap.showMatInCanvas(nameObj.actor);
          data.name.push({
            ms,
            frame,
            payload: { actor: findActorID(nameObj.actor, ms, nameActor) }
          });
        } else if (prevDialog - nameObj.dialog > dialogThreshold) {
          data.name.push({ ms, frame, off: true });
          data.name.push({
            ms,
            frame,
            payload: { actor: findActorID(nameObj.actor, ms, nameActor) }
          });
        }
        prevDialog = nameObj.dialog;
      } else if (refractory.name) {
        data.name.push({ ms, frame, off: true });
        prevDialog = 999999999;
        refractory.name = false;
      }

      if (meanClass.isFadingToBlack()) {
        data.fade.push({ ms, frame, type: 'fadein', color: 'black' });
      } else if (meanClass.isFadingFromBlack()) {
        data.fade.push({ ms, frame, type: 'fadeout', color: 'black' });
      } else if (meanClass.isFadingToWhite()) {
        data.fade.push({ ms, frame, type: 'fadein', color: 'white' });
      } else if (meanClass.isFadingFromWhite()) {
        data.fade.push({ ms, frame, type: 'fadeout', color: 'white' });
      }
    },
    () => {
      writeAss(data, nameActor, vCap);
    }
  );
}
