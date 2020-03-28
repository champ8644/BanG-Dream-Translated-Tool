import {
  chunkCount,
  endVCap,
  meanLength,
  meanSmooth,
  startVCap
} from '../constants/config';

import { fadeThreshold } from '../constants';
import findActorID from './findActorID';
import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import message2UI from '../../../worker/message2UI';
import minMaxFinder from './minMaxFinder';
import moment from 'moment';
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

function showTime(dur) {
  const h = dur.hours();
  const mm = `${dur.minutes()}`.padStart(2, '0');
  const ss = `${dur.seconds()}`.padStart(2, '0');
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

let isLoopValid;
export function devalidLoop() {
  isLoopValid = false;
}
let newStartVCap;
function nonBlockingLoop(count = 1e9, chunksize, callback, finished) {
  let i;
  let useStartVCap = startVCap;
  if (newStartVCap !== null) useStartVCap = newStartVCap;
  i = useStartVCap;
  isLoopValid = true;
  const beginTime = new Date().getTime();
  message2UI('update-progress', {
    percent: 0,
    FPS: 0,
    delay: 1,
    frame: i,
    timePassed: showTime(moment.duration(0)),
    timeLeft: 'determining...',
    timeAll: 'determining...'
  });
  (function chunk() {
    const end = Math.min(i + chunksize, count);
    for (; i < end; i++) {
      if (!isLoopValid) break;
      callback.call(null, i);
    }
    const FPS =
      ((i - useStartVCap) / (new Date().getTime() - beginTime)) * 1000;
    if (i >= count) {
      const timePassed = new Date().getTime() - beginTime;
      message2UI('finish-progress', {
        percent: 100,
        FPS,
        delay: 100,
        frame: i,
        timePassed: showTime(moment.duration(timePassed)),
        timeLeft: 'Job finished',
        timeAll: showTime(moment.duration(timePassed))
      });
      finished.call(null);
    } else if (!isLoopValid) {
      const timePassed = new Date().getTime() - beginTime;
      message2UI('cancel-progress', {
        percent: 100,
        FPS,
        delay: 100,
        frame: i,
        timePassed: showTime(moment.duration(timePassed)),
        timeLeft: 'Job cancelled',
        timeAll: showTime(moment.duration(timePassed))
      });
      finished.call(null);
    } else {
      const timeLeft = ((count - i) / FPS) * 1000;
      const timePassed = new Date().getTime() - beginTime;
      message2UI('update-progress', {
        percent: ((i - useStartVCap) / (count - useStartVCap)) * 100,
        FPS,
        delay: (chunksize / FPS) * 1000,
        frame: i,
        timePassed: showTime(moment.duration(timePassed)),
        timeLeft: showTime(moment.duration(timeLeft)),
        timeAll: showTime(moment.duration(timeLeft + timePassed))
      });
      setTimeout(chunk, 0);
    }
  })();
}

let currentActor;

export default function mainEvent(vCap, _timeLimit) {
  prevDialog = null;
  newStartVCap = null;
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
  let timeLimit = _timeLimit;
  const limitVCap = vCap.length - 1;
  if (timeLimit < 0) {
    timeLimit = endVCap;
    newStartVCap = startVCap;
  } else {
    newStartVCap = 0;
    if (timeLimit > limitVCap || timeLimit === undefined) timeLimit = limitVCap;
  }
  // eslint-disable-line no-console
  nonBlockingLoop(
    timeLimit,
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
      if (placeObj.status) {
        if (!refractory.place) {
          data.place.push({ begin: frame });
          refractory.place = true;
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
        }
      } else if (refractory.title) {
        data.title[data.title.length - 1].end = frame;
        refractory.title = false;
      }

      // console.log('frame', frame); // eslint-disable-line no-console
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
        }
        prevDialog = nameObj.dialog;
      } else if (refractory.name) {
        // vCap.showMatInCanvas(nameObj.actorStar);
        const starMatched = starMatching(mat, currentActor);
        if (starMatched) {
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

      if (minMaxObj.isWhite) {
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
