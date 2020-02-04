import { green, maxHeight, maxWidth } from './constants';

import BGRFinder from './matFunctions/BGRFinder';
import GRAYFinder from './matFunctions/GRAYFinder';
import HSVFinder from './matFunctions/HSVFinder';
import cv from 'opencv4nodejs';
import labelCheck from './matFunctions/labelCheck';
import nameLabelGenerator from './matFunctions/nameLabelGenerator';
import placeFinder from './matFunctions/placeFinder';
import scopeFinder from './matFunctions/scopeFinder';
import subtitleFinder from './matFunctions/subtitleFinder';
import titleFinder from './matFunctions/titleFinder';

export default class VideoCapture {
  constructor({ path, canvas, updateFrame, modePostProcessor, colorSlider }) {
    this.vCap = new cv.VideoCapture(path);
    this.width = this.vCap.get(cv.CAP_PROP_FRAME_WIDTH);
    this.height = this.vCap.get(cv.CAP_PROP_FRAME_HEIGHT);
    this.ratio = Math.max(maxWidth / this.width, maxHeight / this.height);
    this.length = this.vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1;
    this.FPS = this.vCap.get(cv.CAP_PROP_FPS);
    this.dWidth = this.width * this.ratio;
    this.dHeight = this.height * this.ratio;
    this.canvas = canvas;
    this.updateFrame = updateFrame;
    this.colorSlider = colorSlider;
    this.setPostProcessor(modePostProcessor);
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
    if (frame === undefined) return this.vCap.read();
    const currentFrame = this.getFrame(mode);
    if (frame !== currentFrame) this.setFrame(frame, mode);
    return this.vCap.read();
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
    this.updateFrame();
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
    switch (mode) {
      case 'subtitleFinder':
        this.postProcessor = subtitleFinder;
        break;
      case 'place':
        this.postProcessor = placeFinder;
        break;
      case 'title':
        this.postProcessor = titleFinder;
        break;
      case 'labelCheck':
        this.postProcessor = labelCheck;
        break;
      case 'nameLabelGenerator':
        this.postProcessor = nameLabelGenerator;
        break;
      case 'scopeFinder':
        this.postProcessor = scopeFinder;
        break;
      case 'HSVFinder':
        this.postProcessor = HSVFinder;
        break;
      case 'BGRFinder':
        this.postProcessor = BGRFinder;
        break;
      case 'GRAYFinder':
        this.postProcessor = GRAYFinder;
        break;
      default:
        this.postProcessor = null;
    }
  }

  locatedClicked(x, y) {
    const prevFrame = this.getFrame();
    let mat = this.getMat();
    if (mat.empty) return;
    const matAtRaw = mat.atRaw(y, x);
    if (this.postProcessor) mat = this.postProcessor(mat);
    mat.drawCircle(new cv.Point(x, y), 5, green, 10, cv.FILLED);
    this.showMatInCanvas(mat);
    this.setFrame(prevFrame);
    return matAtRaw;
  }

  changeColorSlider(payload) {
    this.colorSlider = payload;
    this.show();
  }
}
