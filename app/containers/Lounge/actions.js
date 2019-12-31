'use strict';

import { maxHeight, maxWidth } from './constants';

import cv from 'opencv4nodejs';
import prefixer from '../../utils/reducerPrefixer';

const prefix = '@@Lounge';
const actionTypesList = ['SELECT_NEW_VIDEO'];

export const actionTypes = prefixer(prefix, actionTypesList);
/*
async function initVideo(path) {
  const vCap = new cv.VideoCapture(path);
  let begin = Date.now();
  let c = 0;
  const frame_no = 100;
  vCap.set(1, frame_no - 1);
  const playVideo = async () => {
    let frame = vCap.read();
    // loop back to start on end of stream reached
    console.log('frame.empty: ', frame.empty);
    console.log('vCap: ', vCap.get(cv.CAP_PROP_POS_FRAMES));
    //cv.CAP_PROP_FRAME_COUNT
    if (frame.empty) {
      vCap.reset();
      begin = Date.now();
      frame = vCap.read();
    }
    console.log('count', c++);
    const outFrame = frame.rescale(1 / this.div);

    const matRGBA =
      outFrame.channels === 1
        ? outFrame.cvtColor(cv.COLOR_GRAY2RGBA)
        : outFrame.cvtColor(cv.COLOR_BGR2RGBA);

    const imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      outFrame.cols,
      outFrame.rows
    );
    // this.canvas.height = outFrame.rows;
    // this.canvas.width = outFrame.cols;
    const ctx = this.canvas.current.getContext('2d');
    ctx.putImageData(imgData, 0, 0);
    const delay = 1000 / this.FPS - (Date.now() - begin);
    setTimeout(playVideo, delay);
  };
  setTimeout(playVideo, 0);
}
*/
export function selectNewVideo(path) {
  const vCap = new cv.VideoCapture(path);
  const width = vCap.get(cv.CAP_PROP_FRAME_WIDTH);
  const height = vCap.get(cv.CAP_PROP_FRAME_HEIGHT);
  const ratio = Math.max(width / maxWidth, height / maxHeight);
  return {
    type: actionTypes.SELECT_NEW_VIDEO,
    payload: {
      videoFilePath: path,
      vCap,
      width,
      height,
      ratio,
      dWidth: width / ratio,
      dHeight: width / height,
      FPS: vCap.get(cv.CAP_PROP_FPS),
      length: vCap.get(cv.CAP_PROP_FRAME_COUNT)
    }
  };
}
