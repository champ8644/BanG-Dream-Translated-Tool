import { chunkCount, meanLength, meanSmooth } from '../constants/config';

import { fadeThreshold } from '../constants';
import findActorID from './findActorID';
import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import message2UI from '../../../worker/message2UI';
import minMaxFinder from './minMaxFinder';
import starMatching from './starMatching';

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

  findFadeInBlack(frame) {
    for (let i = 0; i < this.length; i++) {
      const curFrame = frame - i;
      const avg = this.avg(curFrame);
      if (avg !== null) {
        if (avg - this.at(curFrame) < fadeThreshold) return i - 1;
      } else return null;
    }
    return null;
  }

  isOutOfBlack(frame) {
    return this.at(frame) - this.avg(frame) < fadeThreshold;
  }

  findFadeInWhite(frame) {
    for (let i = 0; i < this.length; i++) {
      const curFrame = frame - i;
      const avg = this.avg(curFrame);
      if (avg !== null) {
        if (this.at(curFrame) - avg < fadeThreshold) return i - 1;
      } else return null;
    }
    return null;
  }

  isOutOfWhite(frame) {
    return this.avg(frame) - this.at(frame - this.div) < fadeThreshold;
  }
}

let prevDialog;
let meanClass;
let data;
let refractory;

let isLoopValid;
export function devalidLoop() {
  isLoopValid = false;
}
function nonBlockingLoop({
  beginFrame = 0,
  endFrame = 1e9,
  limitVCap,
  chunksize,
  callback,
  finished,
  index
}) {
  // eslint-disable-next-line no-console
  console.log({
    beginFrame,
    endFrame,
    limitVCap,
    chunksize,
    callback,
    finished
  });
  let i = beginFrame;
  let isFinishing = false;
  let gracefulFinish = false;
  isLoopValid = true;
  message2UI('begin-progress', { index, beginFrame, endFrame });
  (function chunk() {
    const end = Math.min(i + chunksize, limitVCap);
    let notActive;
    for (; i < end; i++) {
      if (!isLoopValid) break;
      notActive = callback.call(null, i);
      if (isFinishing && notActive) {
        gracefulFinish = true;
        break;
      }
    }
    const frame = i > endFrame ? endFrame : i;
    if (gracefulFinish || i >= limitVCap) {
      message2UI('finish-progress', { index, frame, beginFrame, endFrame });
      finished.call(null);
    } else if (!isLoopValid) {
      message2UI('cancel-progress', { index, frame, beginFrame, endFrame });
      finished.call(null);
    } else {
      message2UI('update-progress', { index, frame, beginFrame, endFrame });
      if (i >= endFrame) isFinishing = true;
      setTimeout(chunk, 0);
    }
  })();
}

let currentActor;

export default function mainEvent({ vCap, start, end, index }) {
  return new Promise(resolve => {
    prevDialog = null;
    meanClass = new Meaning();
    data = {
      name: [],
      place: [],
      title: [],
      fadeB: [],
      fadeW: []
    };
    refractory = {
      name: false,
      place: false,
      title: false,
      fadeB: 0,
      fadeW: 0
    };
    const nameActor = [];
    // eslint-disable-line no-console
    nonBlockingLoop({
      index,
      beginFrame: start,
      endFrame: end,
      limitVCap: vCap.length,
      chunksize: chunkCount,
      callback: i => {
        const frame = i;
        let notActive = true;
        // const ms = (i * 1000) / vCap.FPS;
        // const frame = vCap.getFrame();
        // const ms = vCap.getFrame('ms');
        const mat = vCap.getMat(frame);
        if (mat.empty) {
          isLoopValid = false;
          return;
        }

        const placeObj = makePlaceLabel(mat, refractory.place);
        if (placeObj.status) {
          if (!refractory.place) {
            data.place.push({ begin: frame });
            refractory.place = true;
          } else {
            notActive = false;
          }
        } else if (refractory.place) {
          data.place[data.place.length - 1].end = frame;
          refractory.place = false;
        }

        const titleObj = makeTitleLabel(mat, refractory.title);
        if (titleObj.status) {
          if (!refractory.title) {
            data.title.push({ begin: frame, width: titleObj.width });
            refractory.title = true;
          } else {
            notActive = false;
          }
        } else if (refractory.title) {
          data.title[data.title.length - 1].end = frame;
          refractory.title = false;
        }

        const nameObj = makeNameLabel(mat);
        if (nameObj.status) {
          if (!refractory.name) {
            refractory.name = true;
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.actor, frame, nameActor)
            });
            currentActor = nameObj.actorStar;
          } else if (nameObj.dialog && !prevDialog) {
            data.name[data.name.length - 1].end = frame;
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.actor, frame, nameActor)
            });
            currentActor = nameObj.actorStar;
            notActive = false;
          } else {
            notActive = false;
          }
          prevDialog = nameObj.dialog;
        } else if (refractory.name) {
          // vCap.showMatInCanvas(nameObj.actorStar);
          const starMatched = starMatching(mat, currentActor);
          if (starMatched) {
            notActive = false;
            // nameObj = makeNameLabel(mat, starMatched);
            if (!data.name[data.name.length - 1].shake)
              data.name[data.name.length - 1].shake = [];
            data.name[data.name.length - 1].shake.push({
              frame: frame - data.name[data.name.length - 1].begin,
              ...starMatched
            });
            // if (nameObj.dialog && !prevDialog) {
            //   data.name[data.name.length - 1].end = frame;
            //   data.name.push({
            //     begin: frame,
            //     actor: findActorID(nameObj.actor, frame, nameActor)
            //   });
            // }
            prevDialog = nameObj.dialog;
          } else {
            data.name[data.name.length - 1].end = frame;
            prevDialog = null;
            refractory.name = false;
          }
        }

        const minMaxObj = minMaxFinder(mat);
        meanClass.push(frame, minMaxObj.mean);
        if (minMaxObj.isBlack) {
          if (refractory.fadeB === 0) {
            const beginBlack = meanClass.findFadeInBlack(frame);
            data.fadeB.push({ begin: frame - beginBlack });
            data.fadeB[data.fadeB.length - 1].fadeIn = frame;
            refractory.fadeB = meanSmooth + 1;
          }
        } else if (refractory.fadeB > meanSmooth) {
          notActive = false;
          data.fadeB[data.fadeB.length - 1].fadeOut = frame;
          refractory.fadeB--;
        } else if (refractory.fadeB > 1) {
          notActive = false;
          refractory.fadeB--;
        } else if (refractory.fadeB === 1) {
          if (meanClass.isOutOfBlack(frame)) {
            data.fadeB[data.fadeB.length - 1].end = frame - meanSmooth;
            refractory.fadeB = 0;
          }
        }

        if (minMaxObj.isWhite) {
          if (refractory.fadeW === 0) {
            const beginWhite = meanClass.findFadeInWhite(frame);
            data.fadeW.push({ begin: frame - beginWhite });
            data.fadeW[data.fadeW.length - 1].fadeIn = frame;
            refractory.fadeW = meanSmooth + 1;
          }
        } else if (refractory.fadeW > meanSmooth) {
          notActive = false;
          data.fadeW[data.fadeW.length - 1].fadeOut = frame;
          refractory.fadeW--;
        } else if (refractory.fadeW > 1) {
          notActive = false;
          refractory.fadeW--;
        } else if (refractory.fadeW === 1) {
          if (meanClass.isOutOfWhite(frame)) {
            data.fadeW[data.fadeW.length - 1].end = frame - meanSmooth;
            refractory.fadeW = 0;
          }
        }
        return notActive;
      },
      finished: () => {
        resolve({ data, nameActor });
      }
    });
  });
}
