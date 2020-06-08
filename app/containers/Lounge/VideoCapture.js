import {
  addBlackMat,
  addNameMat,
  addPlaceMat,
  addTitleMat,
  addWhiteMat
} from './matFunctions/additive';
import {
  blackMaxThreshold,
  green,
  maxHeight,
  maxWidth,
  rx,
  whiteMinThreshold
} from './constants';

import cv from 'opencv4nodejs';
import mainEvent from './mainFunctions/mainEvent';
import matFunctions from './matFunctions';

class MaskStoreClass {
  constructor() {
    this.data = {};
    this.rows = 1440;
    this.cols = 1920;
    this.partial = false;
  }

  getRect(index, total, mat) {
    const totalRow = Math.ceil((Math.sqrt(total * 4 + 1) - 1) / 2);
    const totalCol = Math.ceil(Math.sqrt(total));
    const idxRow = Math.floor(index / totalCol);
    const idxCol = index % totalCol;
    const width = this.cols / totalCol;
    const height = this.rows / totalRow;
    const x1 = Math.round(idxCol * width);
    const x2 = Math.round((idxCol + 1) * width);
    const y1 = Math.round(idxRow * height);
    const y2 = Math.round((idxRow + 1) * height);
    // console.log({
    //   index,
    //   total,
    //   mat,
    //   totalRow,
    //   totalCol,
    //   idxRow,
    //   idxCol,
    //   width,
    //   height,
    //   x1,
    //   x2,
    //   y1,
    //   y2
    // });
    if (this.partial)
      return {
        rect: new cv.Rect(x1, y1, x2 - x1, y2 - y1),
        at: { x: x1, y: y1 }
      };
    const progressiveX = (mat.cols - x2 + x1) / (totalCol - 1 || 1);
    // console.log({
    //   progressiveX,
    //   x1: progressiveX * idxCol,
    //   y1: 0,
    //   width: x2 - x1,
    //   height: y2 - y1,
    //   atX1: x1,
    //   atY1: y1
    // });
    return {
      rect: new cv.Rect(progressiveX * idxCol, 0, x2 - x1, y2 - y1),
      at: { x: x1, y: y1 }
    };
  }

  getRatio(total) {
    return 1 / Math.ceil((Math.sqrt(total * 4 + 1) - 1) / 2);
  }

  getMask(mat, index, total) {
    if (this.rows !== mat.rows || this.cols !== mat.cols) {
      this.data = {};
      this.rows = mat.rows;
      this.cols = mat.cols;
    }
    if (!this.data[index]) this.data[index] = {};

    if (this.partial) {
      if (!this.data[index][total])
        this.data[index][total] = this.getRect(index, total);
      const { rect, at } = this.data[index][total];
      return { mat: mat.getRegion(rect), at };
    }
    const smallMat = mat.rescale(this.getRatio(total));
    if (!this.data[index][total])
      this.data[index][total] = this.getRect(index, total, smallMat);
    const { rect, at } = this.data[index][total];
    return { mat: smallMat.getRegion(rect), at };
  }
}

const maskStore = new MaskStoreClass();

export default class VideoCapture {
  constructor({
    path,
    canvas,
    updateFrame,
    modePostProcessor,
    colorSlider,
    maxWidth: _maxWidth = maxWidth,
    maxHeight: _maxHeight = maxHeight
  }) {
    this.vCap = new cv.VideoCapture(path);
    this.width = this.vCap.get(cv.CAP_PROP_FRAME_WIDTH) * rx;
    this.height = this.vCap.get(cv.CAP_PROP_FRAME_HEIGHT) * rx;
    if (this.width < this.height) {
      this.rotate = true;
      const t = this.height;
      this.height = this.width;
      this.width = t;
    } else this.rotate = false;
    this.maxWidth = _maxWidth;
    this.maxHeight = _maxHeight;
    this.ratio = Math.max(
      this.maxWidth / this.width,
      this.maxHeight / this.height
    );
    // if (this.ratio > 1) this.ratio = 1;
    this.length = this.vCap.get(cv.CAP_PROP_FRAME_COUNT) - 1;
    this.FPS = this.vCap.get(cv.CAP_PROP_FPS);
    this.dWidth = this.width * this.ratio;
    this.dHeight = this.height * this.ratio;
    this.path = path;
    this.prevMat = new cv.Mat();
    this.msLength = this.getMsLength();
    this.prevMemoized = [];
    if (canvas) this.canvas = canvas;
    if (updateFrame) this.updateFrame = updateFrame;
    if (colorSlider) this.colorSlider = colorSlider;
    if (modePostProcessor) this.setPostProcessor(modePostProcessor);
  }

  getMsLength() {
    const thisFrame = this.frame();
    this.setFrame(100, 'percent');
    const msLength = this.ms();
    this.setFrame(thisFrame);
    return msLength;
  }

  setCanvas(canvasRef) {
    this.canvas = canvasRef;
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

  getMaxLength(mode = 'frame') {
    switch (mode) {
      case 'frame':
        return this.length;
      case 'ms':
        return this.msLength;
      case 'percent':
        return 100;
      case 'all':
        return { frame: this.length, ms: this.msLength, percent: 100 };
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

  getMat(frame, mode = 'frame', scale = true) {
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
    let readFrame = this.vCap.read();
    if (readFrame.empty) return readFrame;
    if (this.rotate)
      readFrame = readFrame.rotate(cv.ROTATE_90_COUNTERCLOCKWISE);
    if (scale) readFrame = readFrame.rescale(rx);
    return readFrame;
  }

  getImageFromFrame(frame, mode = 'frame') {
    const rawMat = this.getMat(frame, mode);
    if (rawMat.empty) return;
    const mat = rawMat.rescale(this.ratio);
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

  showMatInCanvasMinimal(mat, at = { x: 0, y: 0 }) {
    if (!this.canvas || !this.canvas.current) return;
    if (mat.empty) return;
    const matRGBA =
      mat.channels === 1
        ? mat.cvtColor(cv.COLOR_GRAY2RGBA)
        : mat.cvtColor(cv.COLOR_BGR2RGBA);
    const imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      mat.cols,
      mat.rows
    );
    this.putImageData(imgData, at);
    if (this.updateFrame) this.updateFrame();
  }

  showMatInCanvas(_mat, at = { x: 0, y: 0 }) {
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
    this.putImageData(imgData, { x: at.x * this.ratio, y: at.y * this.ratio });
    if (this.updateFrame) this.updateFrame();
  }

  minMaxFinder(mat) {
    const { maxVal, minVal } = mat.cvtColor(cv.COLOR_BGR2GRAY).minMaxLoc();
    return {
      isBlack: maxVal < blackMaxThreshold,
      isWhite: minVal > whiteMinThreshold
    };
  }

  findNonWhiteMat(frame, mode) {
    const trial = 5;
    const skip = (this.getMaxLength(mode) - frame) / trial;
    let mat;
    for (let i = 0; i < trial; i++) {
      mat = this.getMat(frame + i * skip, mode);
      const { isBlack, isWhite } = this.minMaxFinder(mat);
      if (!isBlack && !isWhite) return mat;
    }
    return mat;
  }

  async asyncNonWhiteRead(frame, mode = 'frame') {
    const rawMat = this.findNonWhiteMat(frame, mode);
    const mat = rawMat.copy();
    if (mat.empty) return;
    this.showMatInCanvas(mat);
  }

  async asyncRead(frame, mode = 'frame') {
    const rawMat = this.getMat(frame, mode);
    let mat = rawMat.copy();
    if (mat.empty) return;
    if (this.postProcessor) mat = this.postProcessor(mat, this);
    this.showMatInCanvas(mat);
    this.prevMat = rawMat;
  }

  read(frame, mode = 'frame') {
    const rawMat = this.getMat(frame, mode);
    let mat = rawMat.copy();
    if (mat.empty) return mat;
    if (this.postProcessor) mat = this.postProcessor(mat, this);
    this.showMatInCanvas(mat);
    this.prevMat = rawMat;
    return mat;
  }

  getRaw(frame, mode = 'frame') {
    let prevFrame;
    if (frame !== undefined) prevFrame = frame;
    else prevFrame = this.getFrame(mode);
    const mat = this.getMat(frame, mode);
    this.setFrame(prevFrame, mode);
    return mat;
  }

  getRawRaw(frame, mode = 'frame') {
    this.setFrame(frame, mode);
    const mat = this.vCap.read();
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

  putImageData(imgData, at = { x: 0, y: 0 }) {
    if (this.canvas)
      this.canvas.current.getContext('2d').putImageData(imgData, at.x, at.y);
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
    let mat = this.prevMat.copy();
    if (mat.empty) return;
    if (this.postProcessor) mat = this.postProcessor(mat, this);
    if (mat.channels === 1) mat = mat.cvtColor(cv.COLOR_GRAY2BGR);
    const matAtRaw = mat.atRaw(y, x);
    mat.drawCircle(new cv.Point(x, y), 5, green, 10, cv.FILLED);
    this.showMatInCanvas(mat);
    return matAtRaw;
  }

  changeColorSlider(payload) {
    if (this.colorSlider) {
      this.colorSlider = { ...this.colorSlider, ...payload };
      this.show();
    }
  }

  fill(color) {
    this.showMatInCanvasMinimal(
      new cv.Mat(this.dHeight, this.dWidth, cv.CV_8UC1, color)
    );
  }

  fillBlack() {
    this.fill(0);
  }

  fillWhite() {
    this.fill(255);
  }

  async updateThumbnail(payload) {
    if (!this.canvas || !this.canvas.current) return;
    const {
      frame,
      name,
      place,
      title,
      star,
      minMax: { isWhite, isBlack },
      index,
      process
    } = payload;
    let mat = this.getMat(frame, undefined, false);
    if (mat.empty) return;
    if (name) mat = addNameMat(mat, star);
    if (place) mat = addPlaceMat(mat);
    if (title) mat = addTitleMat(mat);
    if (isWhite) mat = addWhiteMat(mat);
    if (isBlack) mat = addBlackMat(mat);
    const { at, mat: outputMat } = maskStore.getMask(
      mat.rescale(this.ratio),
      index,
      process
    );
    this.showMatInCanvasMinimal(outputMat, at);
  }

  testingFunc() {
    const raw = this.getMat(10000, undefined, false);
    const { at, mat } = maskStore.getMask(raw.rescale(this.ratio), 4, 6);
    this.showMatInCanvasMinimal(mat, at);
  }

  mainEvent() {
    mainEvent(this);
  }

  putMemoize(payload) {
    this.prevMemoized = payload;
  }

  getMemoize() {
    return this.prevMemoized;
  }
}
