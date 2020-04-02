import { green, maxHeight, maxWidth, rx } from './constants';

import cv from 'opencv4nodejs';
import mainEvent from './mainFunctions/mainEvent';
import matFunctions from './matFunctions';

export default class VideoCapture {
  constructor({ path, canvas, updateFrame, modePostProcessor, colorSlider }) {
    this.vCap = new cv.VideoCapture(path);

    this.width = this.vCap.get(cv.CAP_PROP_FRAME_WIDTH) * rx;
    this.height = this.vCap.get(cv.CAP_PROP_FRAME_HEIGHT) * rx;
    if (this.width < this.height) {
      this.rotate = true;
      const t = this.height;
      this.height = this.width;
      this.width = t;
    } else this.rotate = false;
    this.ratio = Math.max(maxWidth / this.width, maxHeight / this.height);
    // if (this.ratio > 1) this.ratio = 1;
    this.length = this.vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1;
    this.FPS = this.vCap.get(cv.CAP_PROP_FPS);
    this.dWidth = this.width * this.ratio;
    this.dHeight = this.height * this.ratio;
    this.path = path;
    if (canvas) this.canvas = canvas;
    if (updateFrame) this.updateFrame = updateFrame;
    if (colorSlider) this.colorSlider = colorSlider;
    if (modePostProcessor) this.setPostProcessor(modePostProcessor);
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

  getFrame(mode = 'frame') {
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
        return null;
    }
  }

  setFrame(frame, mode = 'frame') {
    if (this.getFrame(mode) === frame) return;
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

  getMat(frame, mode = 'frame') {
    if (frame === undefined) {
      if (this.rotate)
        return this.vCap
          .read()
          .rotate(cv.ROTATE_90_COUNTERCLOCKWISE)
          .rescale(rx);
      return this.vCap.read().rescale(rx);
    }
    const currentFrame = this.getFrame(mode);
    if (frame !== currentFrame) this.setFrame(frame, mode);
    const readFrame = this.vCap.read();
    if (readFrame.empty) return readFrame;
    if (this.rotate)
      return readFrame.rotate(cv.ROTATE_90_COUNTERCLOCKWISE).rescale(rx);
    return readFrame.rescale(rx);
  }

  showMatInCanvas(_mat) {
    if (_mat.empty) return;
    const mat = _mat.rescale(this.ratio);
    const matRGBA =
      mat.channels === 1
        ? mat.cvtColor(cv.COLOR_GRAY2RGBA)
        : mat.cvtColor(cv.COLOR_BGR2RGBA);
    const imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      mat.cols,
      mat.rows
    );
    this.putImageData(imgData);
    if (this.updateFrame) this.updateFrame();
  }

  read(frame, mode = 'frame') {
    let mat = this.getMat(frame, mode);
    if (mat.empty) return;
    if (this.postProcessor) mat = this.postProcessor(mat, this);
    this.showMatInCanvas(mat);
  }

  getRaw(frame, mode = 'frame') {
    let prevFrame;
    if (frame !== undefined) prevFrame = frame;
    else prevFrame = this.getFrame(mode);
    const mat = this.getMat(frame, mode);
    this.setFrame(prevFrame, mode);
    return mat;
  }

  show(frame, mode = 'frame') {
    let prevFrame;
    if (frame !== undefined) prevFrame = frame;
    else prevFrame = this.getFrame(mode);
    this.read(frame, mode);
    this.setFrame(prevFrame, mode);
  }

  step(value, mode = 'frame') {
    const prevFrame = this.getFrame(mode);
    this.show(prevFrame + value, mode);
  }

  putImageData(imgData) {
    if (this.canvas)
      this.canvas.current.getContext('2d').putImageData(imgData, 0, 0);
  }

  async playing() {
    if (!this.isPlaying) return;
    this.read();
    if (this.empty) {
      this.vCap.setFrame(0);
      this.read();
    }
    setTimeout(this.playing.bind(this), 0);
  }

  play() {
    this.isPlaying = true;
    setTimeout(this.playing.bind(this), 0);
  }

  stop() {
    this.isPlaying = false;
  }

  setPostProcessor(mode) {
    this.postProcessor = matFunctions[mode] ? matFunctions[mode] : null;
  }

  locatedClicked(x, y) {
    const prevFrame = this.getFrame();
    let mat = this.getMat();
    if (mat.empty) return;
    const matAtRaw = mat.atRaw(y, x);
    if (this.postProcessor) mat = this.postProcessor(mat, this);
    mat.drawCircle(new cv.Point(x, y), 5, green, 10, cv.FILLED);
    this.showMatInCanvas(mat);
    this.setFrame(prevFrame);
    return matAtRaw;
  }

  changeColorSlider(payload) {
    if (this.colorSlider) {
      this.colorSlider = { ...this.colorSlider, ...payload };
      this.show();
    }
  }

  mainEvent() {
    mainEvent(this);
  }
}
