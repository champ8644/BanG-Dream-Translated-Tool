import { meanLength, meanSmooth } from '../constants/config';

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

  at(frame) {
    return this.data[frame % this.length];
  }

  push(frame, val) {
    this.data[frame % this.length] = val;
  }

  isFadingFromBlack() {}

  isFadingToWhite() {}

  isFadingFromWhite() {}
}

const meanInstance = new Meaning();
export default meanInstance;
