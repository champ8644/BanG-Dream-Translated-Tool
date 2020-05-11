import {
  RESEARCH_SKIP,
  fadeThreshold,
  intersectCompensate,
  skipDialogCountThreshold
} from '../constants';
import {
  chunkCount,
  meanLength,
  meanSmooth,
  updateThumbnailInterval
} from '../constants/config';

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

function trimPayload(payload) {
  const {
    frame,
    placeObj,
    titleObj,
    nameObj,
    minMaxObj: { isWhite, isBlack },
    starMatched,
    index,
    process
  } = payload;
  return {
    frame,
    name: nameObj.status,
    place: placeObj.status,
    title: titleObj.status,
    star: starMatched,
    minMax: { isWhite, isBlack },
    index,
    process
  };
}

// let tempCount = 0;

// function isSkippable(payload) {
//   // const { activeWorking, info } = payload;
//   if (!(tempCount % 100)) console.log(payload);
//   tempCount++;
//   return false;
// }

let prevDialog;
let meanClass;
let data;
let refractory;

let isLoopValid;
export function devalidLoop() {
  isLoopValid = false;
}

function trySkip({ frame, vCap, prevDialog }) {
  let i = frame;
  let canSkip;
  const limitVCap = vCap.current.length;
  do {
    canSkip = false;
    if (i + RESEARCH_SKIP >= limitVCap)
      return { frameAfterSkip: i, refracSkip: limitVCap };
    const mat = vCap.next.getMat(i + RESEARCH_SKIP);
    if (mat.empty) {
      isLoopValid = false;
      return { frameAfterSkip: i, refracSkip: i };
    }
    const { status, dialog } = makeNameLabel(mat);
    if (status) canSkip = !isNewDialog(dialog, prevDialog);
    if (canSkip) {
      vCap.switch();
      i += RESEARCH_SKIP;
    }
  } while (canSkip);
  // if (frame < i) console.log('skipped', frame, '->', i);
  // else console.log('failed skip', i);
  return { frameAfterSkip: i, refracSkip: i + RESEARCH_SKIP };
}

function nonBlockingLoop({
  beginFrame = 0,
  endFrame = 1e9,
  vCap,
  process,
  chunksize,
  callback,
  finished,
  index
}) {
  // eslint-disable-next-line no-console
  console.log({
    beginFrame,
    endFrame,
    chunksize,
    callback,
    finished
  });
  let i = beginFrame;
  let gracefulFinish = false;
  isLoopValid = true;
  message2UI('begin-progress', {
    path: vCap.current.path,
    index,
    beginFrame,
    endFrame
  });
  let prevTime =
    new Date().getTime() + index * (updateThumbnailInterval / process);
  // console.log('prevTime: ', prevTime);
  let frameAfterSkip;
  let refracSkip = 0;
  let prevDataNameLength = -1;
  (function chunk() {
    const end = Math.min(i + chunksize, vCap.current.length);
    let activeWorking;
    let info;
    for (; i < end; i++) {
      if (!isLoopValid) break;
      ({ activeWorking, info } = callback(i));
      if (i >= endFrame + intersectCompensate && !activeWorking.notEmpty) {
        gracefulFinish = true;
        break;
      }
      if (
        data.name &&
        data.name.length > 0 &&
        data.name[data.name.length - 1] &&
        !data.name[data.name.length - 1].end &&
        prevDataNameLength < data.name.length
      ) {
        prevDataNameLength = data.name.length;
        refracSkip = i;
      }
      if (activeWorking.skipable && i >= refracSkip) {
        ({ frameAfterSkip, refracSkip } = trySkip({
          frame: i,
          vCap,
          prevDialog: info.nameObj.dialog
        }));
        i = frameAfterSkip;
      }
    }
    // const frame = i > endFrame ? endFrame : i;
    message2UI('update-progress', {
      path: vCap.current.path,
      index,
      frame: i,
      beginFrame,
      endFrame
    });
    const now = new Date().getTime();
    // console.log('now: ', now, now - prevTime);
    if (now - prevTime > updateThumbnailInterval) {
      prevTime = now;
      // console.log('update Thumbnail');
      message2UI('update-thumbnail', {
        path: vCap.current.path,
        info: trimPayload(info)
      });
    }
    if (gracefulFinish || i >= vCap.current.length) finished(true);
    else if (!isLoopValid) finished(false);
    else setTimeout(chunk, 0);
  })();
}

let currentActor;
// let prevFullDialog;

export default function mainEvent({ vCap, start, end, index, process }) {
  return new Promise(resolve => {
    prevDialog = null;
    meanClass = new Meaning();
    data = {
      name: [],
      place: [],
      title: [],
      fadeB: [],
      fadeW: [],
      skip: [],
      empty: []
    };
    refractory = {
      name: false,
      place: false,
      title: false,
      fadeB: 0,
      fadeW: 0,
      star: 0,
      skip: false,
      empty: false
    };
    const nameActor = [];
    // eslint-disable-line no-console
    nonBlockingLoop({
      index,
      process,
      beginFrame: start,
      endFrame: end,
      vCap,
      chunksize: chunkCount,
      callback: frame => {
        const mat = vCap.current.getMat(frame);
        if (mat.empty) {
          isLoopValid = false;
          return;
        }
        const placeObj = makePlaceLabel(mat, refractory.place);
        const titleObj = makeTitleLabel(mat, refractory.title);
        const nameObj = makeNameLabel(mat);
        const minMaxObj = minMaxFinder(mat);
        let starMatched;

        let activeWorking = {};
        // const ms = (i * 1000) / vCap.current.FPS;
        // const frame = vCap.current.getFrame();
        // const ms = vCap.current.getFrame('ms');

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

        // if (frame >= 112405 && frame <= 112630) console.log(frame, nameObj);
        if (nameObj.status && refractory.star === 0) {
          if (isNewDialog(nameObj.dialog, prevDialog)) {
            if (refractory.name) {
              // console.log(1.1);
              data.name[data.name.length - 1].end = frame;
            } else {
              // console.log(1.2);

              activeWorking = {
                ...activeWorking,
                nameObj: true,
                notEmpty: true
              };
            }
            data.name.push({
              begin: frame,
              actor: findActorID(nameObj.currentActor.actor, frame, nameActor)
            });
            ({ currentActor } = nameObj);
          } else {
            // console.log(2);
            if (nameObj.dialog.countNonZero() > skipDialogCountThreshold)
              activeWorking = {
                ...activeWorking,
                skipable: true
              };
            activeWorking = {
              ...activeWorking,
              nameObj: true,
              notEmpty: true
            };
          }
          refractory.name = true;
          prevDialog = nameObj.dialog;
          // console.log('new dialog at', frame);
        } else if (refractory.name) {
          // vCap.current.showMatInCanvas(nameObj.actorStar);
          starMatched = starMatching(mat, currentActor);
          // console.log('starMatched: ', starMatched);
          // console.log('refractory: ', { ...refractory });
          // console.log('nameObj: ', nameObj);
          if (starMatched) {
            if (starMatched.x === 0 && starMatched.y === 0) {
              if (refractory.star) {
                if (!nameObj.status) {
                  // console.log(3.111, 'สั่นปลอม + เคยมีสั่น + ไม่เจอactor');
                  refractory.star--;
                } else if (isNewDialog(nameObj.dialog, prevDialog)) {
                  // console.log(
                  //   3.112,
                  //   'สั่นปลอม + เคยมีสั่น + เจอactor + เป็นรูปใหม่'
                  // );
                  data.name[data.name.length - 1].end = frame;
                  data.name.push({
                    begin: frame,
                    actor: findActorID(
                      nameObj.currentActor.actor,
                      frame,
                      nameActor
                    )
                  });
                  ({ currentActor } = nameObj);
                  refractory.star = 0;
                  prevDialog = nameObj.dialog;
                  // console.log('new dialog at', frame);
                } else {
                  // console.log(
                  //   3.113,
                  //   'สั่นปลอม + เคยมีสั่น + เจอactor + เป็นรูปเก่า'
                  // );
                  refractory.star--;
                }
              } else if (!nameObj.status) {
                // console.log(3.121, 'สั่นปลอม + ไม่เคยมีสั่น + ไม่เจอactor');
                refractory.star--;
              } else if (isNewDialog(nameObj.dialog, prevDialog)) {
                // console.log(
                //   3.122,
                //   'สั่นปลอม + ไม่เคยมีสั่น + เจอactor + เป็นรูปเก่า'
                // );
                data.name[data.name.length - 1].end = frame;
                data.name.push({
                  begin: frame,
                  actor: findActorID(
                    nameObj.currentActor.actor,
                    frame,
                    nameActor
                  )
                });
                ({ currentActor } = nameObj);
                refractory.star = 0;
                prevDialog = nameObj.dialog;
                // console.log('new dialog at', frame);
              } else {
                // console.log(
                //   3.123,
                //   'สั่นปลอม + ไม่เคยมีสั่น + เจอactor + เป็นรูปเก่า'
                // );
                refractory.star--;
              }
            } else {
              // console.log(3.2, 'สั่นจริง');
              refractory.star = 10;
            }
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
            // console.log(4);
            data.name[data.name.length - 1].end = frame;
            // prevDialog = null;
            //
            refractory.name = false;
            refractory.star = 0;
          }
        }

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

        if (activeWorking.skipable) {
          if (!refractory.skip) {
            data.skip.push({ begin: frame });
            refractory.skip = true;
          }
        } else if (refractory.skip) {
          data.skip[data.skip.length - 1].end = frame;
          refractory.skip = false;
        }

        const noskipEmpty =
          activeWorking.notEmpty ||
          placeObj.status ||
          titleObj.status ||
          nameObj.status;

        if (!noskipEmpty) {
          if (!refractory.empty) {
            data.empty.push({ begin: frame });
            refractory.empty = true;
          }
        } else if (refractory.empty) {
          data.empty[data.empty.length - 1].end = frame;
          refractory.empty = false;
        }

        return {
          activeWorking,
          info: {
            frame,
            placeObj,
            titleObj,
            nameObj,
            minMaxObj,
            starMatched,
            index,
            process
          }
        };
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
                limitVCap: vCap.current.length,
                path: vCap.current.path,
                FPS: vCap.current.FPS,
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
