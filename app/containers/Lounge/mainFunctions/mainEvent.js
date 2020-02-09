import makeNameLabel from './makeNameLabel';
import makePlaceLabel from './makePlaceLabel';
import makeTitleLabel from './makeTitleLabel';
import meanFinder from './meanFinder';
import writeAss from './writeAss';

const dialogThreshold = 10;

class Meaning {
  constructor() {
    this.data = [];
    this.div = 5;
    this.length = 100;
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

let frame = 0;
let ms = 0;
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

export default function mainEvent(vCap) {
  let mat = vCap.getMat(frame);
  while (!mat.empty) {
    const placeObj = makePlaceLabel(mat, refractory.place);
    if (placeObj.status) {
      if (!refractory.place) {
        data.place.push({ ms, frame, payload: placeObj.payload });
        refractory.place = true;
      }
    } else if (refractory.place) {
      data.place.push({ ms, frame, off: true });
      refractory.place = false;
    }

    const titleObj = makeTitleLabel(mat, refractory.title);
    if (titleObj.status) {
      if (!refractory.title) {
        data.title.push({ ms, frame, payload: titleObj.payload });
        refractory.title = true;
      }
    } else if (refractory.title) {
      data.title.push({ ms, frame, off: true });
      refractory.title = false;
    }

    const nameObj = makeNameLabel(mat);
    if (nameObj.status) {
      if (!refractory.name) {
        refractory.name = true;
        if (prevDialog - nameObj.dialog > dialogThreshold)
          data.name.push({ ms, frame, actor: nameObj.actor });
      } else if (prevDialog - nameObj.dialog > dialogThreshold) {
        data.name.push({ ms, frame, off: true });
        data.name.push({ ms, frame, actor: nameObj.actor });
      }
      prevDialog = nameObj.dialog;
    } else if (refractory.name) {
      data.name.push({ ms, frame, off: true });
      prevDialog = 999999999;
      refractory.name = false;
    }

    meanClass.push(frame, meanFinder(mat));
    if (meanClass.isFadingToBlack()) {
      data.fade.push({ ms, frame, type: 'fadein', color: 'black' });
    } else if (meanClass.isFadingFromBlack()) {
      data.fade.push({ ms, frame, type: 'fadeout', color: 'black' });
    } else if (meanClass.isFadingToWhite()) {
      data.fade.push({ ms, frame, type: 'fadein', color: 'white' });
    } else if (meanClass.isFadingFromWhite()) {
      data.fade.push({ ms, frame, type: 'fadeout', color: 'white' });
    }

    frame = vCap.getFrame();
    ms = vCap.getFrame('ms');
    mat = vCap.getMat();
    if (frame > 1) break;
  }
  writeAss(data, vCap);
}
