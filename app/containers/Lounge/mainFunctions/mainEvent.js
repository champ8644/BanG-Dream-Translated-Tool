import {
  blackThreshold,
  chunkCount,
  dialogThreshold,
  fadeThreshold,
  limitVCap,
  meanLength,
  meanSmooth,
  startVCap,
  whiteThreshold
} from '../constants';

import findActorID from './findActorID';
import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import meanFinder from './meanFinder';
import message2UI from '../../../worker/message2UI';
import starMatching from './starMatching';
import writeAss from './writeAss';

class Meaning {
  constructor() {
    this.data = [];
    this.div = meanSmooth;
    this.length = meanLength;
  }

  avg(frame) {
    if (frame - this.div < 0) return null;
    let sum = 0;
    for (let i = 1; i <= this.div; i++) {
      const prevFrame = (frame - i + this.length) % this.length;
      sum += this.data[prevFrame] || 0;
    }
    return sum / this.div;
  }

  at(frame) {
    return this.data[(frame + this.length) % this.length];
  }

  push(frame, val) {
    this.data[(frame + this.length) % this.length] = val;
  }

  isBlack(frame) {
    return this.data[frame % this.length] < blackThreshold;
  }

  findFadeInBlack(frame) {
    for (let i = 0; i < this.length; i++) {
      const curFrame = frame - i;
      const avg = this.avg(curFrame);
      if (avg !== null) {
        if (avg - this.at(curFrame) < fadeThreshold) return i;
      } else return null;
    }
    return null;
  }

  isOutOfBlack(frame) {
    return this.avg(frame) - this.at(frame - this.div) < fadeThreshold;
  }

  isWhite(frame) {
    return this.data[frame % this.length] > whiteThreshold;
  }

  findFadeInWhite(frame) {
    for (let i = 0; i < this.length; i++) {
      const curFrame = frame - i;
      const avg = this.avg(curFrame);
      if (avg !== null) {
        if (this.at(curFrame) - avg < fadeThreshold) return i;
      } else return null;
    }
    return null;
  }

  isOutOfWhite(frame) {
    return this.at(frame - this.div) - this.avg(frame) < fadeThreshold;
  }
}

let prevDialog = 999999999;
const meanClass = new Meaning();
const data = {
  name: [],
  place: [],
  title: [],
  fadeB: [],
  fadeW: []
};
const refractory = {
  name: false,
  place: false,
  title: false,
  fadeB: 0,
  fadeW: 0
};

let isLoopValid;
function nonBlockingLoop(count = 1e9, chunksize, callback, finished) {
  let i = startVCap;
  isLoopValid = true;
  const beginTime = new Date().getTime();
  (function chunk() {
    const end = Math.min(i + chunksize, count);
    for (; i < end; i++) {
      callback.call(null, i);
    }
    // eslint-disable-next-line no-console
    console.log({
      frame: i,
      FPS: ((i - startVCap) / (new Date().getTime() - beginTime)) * 1000
    });
    message2UI(
      'update-progress',
      ((i - startVCap) / (count - startVCap)) * 100
    );
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
    chunkCount,
    i => {
      const frame = i;
      // const ms = (i * 1000) / vCap.FPS;
      // const frame = vCap.getFrame();
      // const ms = vCap.getFrame('ms');
      const mat = vCap.getMat(frame);
      if (mat.empty) {
        isLoopValid = false;
        return;
      }
      const placeObj = makePlaceLabel(mat, refractory.place);
      const titleObj = makeTitleLabel(mat, refractory.title);
      let nameObj = makeNameLabel(mat);

      meanClass.push(frame, meanFinder(mat));

      if (placeObj.status) {
        if (!refractory.place) {
          data.place.push({ begin: frame });
          refractory.place = true;
        }
      } else if (refractory.place) {
        data.place[data.place.length - 1].end = frame;
        refractory.place = false;
      }

      if (titleObj.status) {
        if (!refractory.title) {
          data.title.push({ begin: frame, width: titleObj.width });
          refractory.title = true;
        }
      } else if (refractory.title) {
        data.title[data.title.length - 1].end = frame;
        refractory.title = false;
      }

      if (nameObj.status) {
        if (!refractory.name) {
          refractory.name = true;
          // if (prevDialog - nameObj.dialog > dialogThreshold)
          //   vCap.showMatInCanvas(nameObj.actor);
          data.name.push({
            begin: frame,
            actor: findActorID(nameObj.actor, frame, nameActor)
          });
        } else if (prevDialog - nameObj.dialog > dialogThreshold) {
          data.name[data.name.length - 1].end = frame;
          data.name.push({
            begin: frame,
            actor: findActorID(nameObj.actor, frame, nameActor)
          });
        }
        prevDialog = nameObj.dialog;
      } else if (refractory.name) {
        const starMatched = starMatching(mat);

        if (starMatched) {
          nameObj = makeNameLabel(mat, starMatched);

          if (!data.name[data.name.length - 1].shake)
            data.name[data.name.length - 1].shake = [];
          data.name[data.name.length - 1].shake.push({ frame, ...starMatched });
          if (prevDialog - nameObj.dialog > dialogThreshold) {
            data.name[data.name.length - 1].end = frame;
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.actor, frame, nameActor)
            });
          }
          prevDialog = nameObj.dialog;
        } else {
          data.name[data.name.length - 1].end = frame;
          prevDialog = 999999999;
          refractory.name = false;
        }
      }

      if (meanClass.isBlack(frame)) {
        if (refractory.fadeB === 0) {
          const beginBlack = meanClass.findFadeInBlack(frame);
          data.fadeB.push({ begin: frame - beginBlack });
          data.fadeB[data.fadeB.length - 1].fadeIn = frame;
          refractory.fadeB = meanSmooth + 1;
        }
      } else if (refractory.fadeB > meanSmooth) {
        data.fadeB[data.fadeB.length - 1].fadeOut = frame;
        refractory.fadeB--;
      } else if (refractory.fadeB > 1) {
        refractory.fadeB--;
      } else if (refractory.fadeB === 1) {
        if (meanClass.isOutOfBlack(frame)) {
          data.fadeB[data.fadeB.length - 1].end = frame - meanSmooth;
          refractory.fadeB = 0;
        }
      }

      if (meanClass.isWhite(frame)) {
        if (refractory.fadeW === 0) {
          const beginWhite = meanClass.findFadeInWhite(frame);
          data.fadeW.push({ begin: frame - beginWhite });
          data.fadeW[data.fadeW.length - 1].fadeIn = frame;
          refractory.fadeW = meanSmooth + 1;
        }
      } else if (refractory.fadeW > meanSmooth) {
        data.fadeW[data.fadeW.length - 1].fadeOut = frame;
        refractory.fadeW--;
      } else if (refractory.fadeW > 1) {
        refractory.fadeW--;
      } else if (refractory.fadeW === 1) {
        if (meanClass.isOutOfWhite(frame)) {
          data.fadeW[data.fadeW.length - 1].end = frame - meanSmooth;
          refractory.fadeW = 0;
        }
      }
    },
    () => {
      writeAss(data, nameActor, vCap);
    }
  );
}
