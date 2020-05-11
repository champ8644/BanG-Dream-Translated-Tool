import VideoCapture from './VideoCapture';

export default class BiVideoCapture {
  constructor(payload) {
    const { path } = payload;
    this.vCap = [new VideoCapture({ path }), new VideoCapture({ path })];
    this.primary = 0;
    this.reset();
  }

  reset() {
    this.current = this.vCap[this.primary];
    this.next = this.vCap[this.primary ^ 1];
  }

  switch() {
    this.primary = this.primary ^ 1;
    this.reset();
  }
}
