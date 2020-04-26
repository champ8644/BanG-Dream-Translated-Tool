import { chunkCount, meanLength, meanSmooth } from '../constants/config';
import { fadeThreshold, intersectCompensate } from '../constants';

import cv from 'opencv4nodejs';
import findActorID from './findActorID';
import isNewDialog from './isNewDialog';
import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import message2UI from '../../../worker/message2UI';
import minMaxFinder from './minMaxFinder';
import starMatching from './starMatching';
import tmp from 'tmp-promise';
import { v4 as uuidv4 } from 'uuid';

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
    return this.at(frame - this.div) - this.avg(frame) < fadeThreshold;
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
  path,
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
  let gracefulFinish = false;
  isLoopValid = true;
  message2UI('begin-progress', { path, index, beginFrame, endFrame });
  (function chunk() {
    const end = Math.min(i + chunksize, limitVCap);
    let activeWorking;
    for (; i < end; i++) {
      if (!isLoopValid) break;
      activeWorking = callback.call(null, i);
      if (i >= endFrame + intersectCompensate && !activeWorking.notEmpty) {
        gracefulFinish = true;
        break;
      }
    }
    // const frame = i > endFrame ? endFrame : i;
    message2UI('update-progress', {
      path,
      index,
      frame: i,
      beginFrame,
      endFrame
    });
    if (gracefulFinish || i >= limitVCap) finished.call(null, true);
    else if (!isLoopValid) finished.call(null, false);
    else setTimeout(chunk, 0);
  })();
}

let currentActor;
// let prevFullDialog;

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
      fadeW: 0,
      star: 0
    };
    const nameActor = [];
    // eslint-disable-line no-console
    nonBlockingLoop({
      index,
      beginFrame: start,
      endFrame: end,
      limitVCap: vCap.length,
      path: vCap.path,
      chunksize: chunkCount,
      callback: i => {
        const frame = i;
        let activeWorking = {};
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
          } else
            activeWorking = {
              ...activeWorking,
              placeObj: true,
              notEmpty: true
            };
        } else if (refractory.place) {
          data.place[data.place.length - 1].end = frame;
          refractory.place = false;
        }

        const titleObj = makeTitleLabel(mat, refractory.title);
        if (titleObj.status) {
          if (!refractory.title) {
            data.title.push({ begin: frame, width: titleObj.width });
            refractory.title = true;
          } else
            activeWorking = {
              ...activeWorking,
              titleObj: true,
              notEmpty: true
            };
        } else if (refractory.title) {
          data.title[data.title.length - 1].end = frame;
          refractory.title = false;
        }

        const nameObj = makeNameLabel(mat);
        if (nameObj.status && refractory.star === 0) {
          if (!refractory.name) {
            refractory.name = true;
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.actor, frame, nameActor)
            });
            currentActor = nameObj.actorStar;
          } else if (isNewDialog(nameObj.dialog, prevDialog)) {
            data.name[data.name.length - 1].end = frame;
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.actor, frame, nameActor)
            });
            currentActor = nameObj.actorStar;
          } else
            activeWorking = { ...activeWorking, nameObj: true, notEmpty: true };
          prevDialog = nameObj.dialog;
        } else if (refractory.name) {
          // vCap.showMatInCanvas(nameObj.actorStar);
          const starMatched = starMatching(mat, currentActor);
          if (starMatched) {
            if (starMatched.x === 0 && starMatched.y === 0) refractory.star--;
            else refractory.star = 10;
            activeWorking = {
              ...activeWorking,
              nameObj: true,
              star: true,
              notEmpty: true
            };
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
            // prevDialog = nameObj.dialog;
          } else {
            data.name[data.name.length - 1].end = frame;
            prevDialog = null;
            refractory.name = false;
          }
        }

        const minMaxObj = minMaxFinder(mat);
        meanClass.push(frame, minMaxObj.mean);
        if (minMaxObj.isBlack) {
          activeWorking = { ...activeWorking, fadeB: true, notEmpty: true };
          if (refractory.fadeB === 0) {
            const beginBlack = meanClass.findFadeInBlack(frame);
            data.fadeB.push({ begin: frame - beginBlack });
            data.fadeB[data.fadeB.length - 1].fadeIn = frame;
            refractory.fadeB = meanSmooth + 1;
          }
        } else if (refractory.fadeB > meanSmooth) {
          activeWorking = { ...activeWorking, fadeB: true, notEmpty: true };
          data.fadeB[data.fadeB.length - 1].fadeOut = frame;
          refractory.fadeB--;
        } else if (refractory.fadeB > 1) {
          activeWorking = { ...activeWorking, fadeB: true, notEmpty: true };
          refractory.fadeB--;
        } else if (refractory.fadeB === 1) {
          if (meanClass.isOutOfBlack(frame)) {
            data.fadeB[data.fadeB.length - 1].end = frame - meanSmooth;
            refractory.fadeB = 0;
          } else
            activeWorking = { ...activeWorking, fadeB: true, notEmpty: true };
        }

        if (minMaxObj.isWhite) {
          activeWorking = { ...activeWorking, fadeW: true, notEmpty: true };
          if (refractory.fadeW === 0) {
            const beginWhite = meanClass.findFadeInWhite(frame);
            data.fadeW.push({ begin: frame - beginWhite });
            data.fadeW[data.fadeW.length - 1].fadeIn = frame;
            refractory.fadeW = meanSmooth + 1;
          }
        } else if (refractory.fadeW > meanSmooth) {
          activeWorking = { ...activeWorking, fadeW: true, notEmpty: true };
          data.fadeW[data.fadeW.length - 1].fadeOut = frame;
          refractory.fadeW--;
        } else if (refractory.fadeW > 1) {
          activeWorking = { ...activeWorking, fadeW: true, notEmpty: true };
          refractory.fadeW--;
        } else if (refractory.fadeW === 1) {
          if (meanClass.isOutOfWhite(frame)) {
            data.fadeW[data.fadeW.length - 1].end = frame - meanSmooth;
            refractory.fadeW = 0;
          } else
            activeWorking = { ...activeWorking, fadeW: true, notEmpty: true };
        }
        return activeWorking;
      },
      finished: finished => {
        tmp
          .dir({ unsafeCleanup: true })
          .then(({ path }) => {
            nameActor.forEach(actorData => {
              const fileName = `${path}\\${uuidv4()}.png`;
              cv.imwrite(fileName, actorData.actor);
              // eslint-disable-next-line no-param-reassign
              actorData.actor = fileName;
            });
            resolve({
              data,
              nameActor,
              finished,
              info: {
                limitVCap: vCap.length,
                path: vCap.path,
                FPS: vCap.FPS,
                beginFrame: start,
                endFrame: end,
                index
              }
            });
            return null;
          })
          .catch(() => {});
      }
    });
  });
}
