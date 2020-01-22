import { maxHeight, maxWidth } from './constants';

import cv from 'opencv4nodejs';

export default class VideoCapture {
  constructor(path) {
    this.vCap = new cv.VideoCapture(path);
    this.width = this.vCap.get(cv.CAP_PROP_FRAME_WIDTH);
    this.height = this.vCap.get(cv.CAP_PROP_FRAME_HEIGHT);
    this.ratio = Math.max(maxWidth / this.width, maxHeight / this.height);
    this.length = this.vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1;
    this.FPS = this.vCap.get(cv.CAP_PROP_FPS);
    this.dWidth = this.width * this.ratio;
    this.dHeight = this.height * this.ratio;
  }

  frame() {
    return this.vCap.get(cv.CAP_PROP_POS_FRAMES);
  }

  percent() {
    return this.vCap.get(cv.CAP_PROP_POS_AVI_RATIO) * 100;
  }

  ms() {
    return this.vCap.get(cv.CAP_PROP_POS_MSEC);
  }

  getPos(mode = 'frame') {
    switch (mode) {
      case 'frame':
        return this.frame();
      case 'ms':
        return this.ms();
      case 'percent':
        return this.percent();
      case 'all':
        return { frame: this.frame(), ms: this.ms(), percent: this.percent() };
      default:
    }
  }

  setFrame(frame, mode = 'frame') {
    if (this.getPos(mode) === frame) return;
    switch (mode) {
      case 'frame':
        this.vCap.set(cv.CAP_PROP_POS_FRAMES, frame);
        break;
      case 'ms':
        this.vCap.set(cv.CAP_PROP_POS_MSEC, frame);
        break;
      case 'percent':
        this.vCap.set(cv.CAP_PROP_POS_AVI_RATIO, frame / 100);
        break;
      default:
    }
  }

  getFrame(frame, mode = 'frame') {
    if (frame === undefined) return this.vCap.read();
    const currentFrame = this.getPos(mode);
    if (frame !== currentFrame) this.setFrame(frame, mode);
    return this.vCap.read();
  }

  read(frame, mode = 'frame') {
    const mat = this.getFrame(frame, mode).rescale(this.ratio);
    const matRGBA =
      mat.channels === 1
        ? mat.cvtColor(cv.COLOR_GRAY2RGBA)
        : mat.cvtColor(cv.COLOR_BGR2RGBA);
    const imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      mat.cols,
      mat.rows
    );
    return imgData;
  }

  getImage(frame, mode = 'frame') {
    const pos = this.getPos();
    const imgData = this.read(frame, mode);
    this.setFrame(pos);
    return imgData;
  }
}

// function putImage(canvasRef, _frame, ratio) {
//   const frame = ratio ? _frame.rescale(ratio) : _frame;
//   const matRGBA =
//     frame.channels === 1
//       ? frame.cvtColor(cv.COLOR_GRAY2RGBA)
//       : frame.cvtColor(cv.COLOR_BGR2RGBA);
//   const imgData = new ImageData(
//     new Uint8ClampedArray(matRGBA.getData()),
//     frame.cols,
//     frame.rows
//   );
//   frame.release();

//   canvasRef.current.getContext('2d').putImageData(imgData, 0, 0);

// const putFrame = _frame => dispatch => {
//   dispatch(updateFrame(current));
//   let frame;
//   if (_frame) frame = _frame;
//   else frame = vCap.read();
//   if (frame.empty) return false;
//   findTextBubble(frame);
//   putImage(canvasRef, frame, ratio);
//   if (_frame) return true;
//   frame.release();
// };
