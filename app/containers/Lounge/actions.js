'use strict';

import { maxHeight, maxWidth } from './constants';

import cv from 'opencv4nodejs';
import path from 'path';
import prefixer from '../../utils/reducerPrefixer';
import { remote } from 'electron';

const { dialog } = remote;
const { app } = remote;

const prefix = '@@Lounge';
const actionTypesList = ['SELECT_NEW_VIDEO', 'SEND_CANVAS'];

export const actionTypes = prefixer(prefix, actionTypesList);

export function sendCanvas(canvasRef) {
  return {
    type: actionTypes.SEND_CANVAS,
    payload: canvasRef
  };
}

export function openFile() {
  return dispatch => {
    const toLocalPath = path.resolve(app.getPath('desktop'));
    const userChosenPath = dialog.showOpenDialog({
      defaultPath: toLocalPath,
      properties: ['openFile'],
      filters: [
        {
          name: 'Video files',
          extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
        }
      ]
    });
    if (!userChosenPath) return;
    dispatch(selectNewVideo(userChosenPath[0]));
  };
}

function selectNewVideo(path) {
  return (dispatch, getState) => {
    const vCap = new cv.VideoCapture(path);
    const width = vCap.get(cv.CAP_PROP_FRAME_WIDTH);
    const height = vCap.get(cv.CAP_PROP_FRAME_HEIGHT);
    const ratio = Math.max(width / maxWidth, height / maxHeight);
    dispatch({
      type: actionTypes.SELECT_NEW_VIDEO,
      payload: {
        videoFilePath: path,
        vCap,
        vCapPackage: {
          width,
          height,
          ratio,
          dWidth: width / ratio,
          dHeight: width / height,
          FPS: vCap.get(cv.CAP_PROP_FPS),
          length: vCap.get(cv.CAP_PROP_FRAME_COUNT),
          vFrame: () => vCap.get(cv.CAP_PROP_POS_FRAMES),
          vPercent: () => vCap.get(cv.CAP_PROP_POS_AVI_RATIO * 100),
          vMs: () => vCap.get(cv.CAP_PROP_POS_MSEC)
        }
      }
    });
    const { ctx } = getState().Lounge;
    const frame = vCap.read();
    putImage(ctx, frame, ratio);
  };
}

function putImage(ctx, _frame, ratio) {
  const frame = ratio ? _frame.rescale(ratio) : _frame;
  const matRGBA =
    frame.channels === 1
      ? frame.cvtColor(cv.COLOR_GRAY2RGBA)
      : frame.cvtColor(cv.COLOR_BGR2RGBA);
  const imgData = new ImageData(
    new Uint8ClampedArray(matRGBA.getData()),
    frame.cols,
    frame.rows
  );
  ctx.putImageData(imgData, 0, 0);
}

export function playVideo() {
  return (dispatch, getState) => {
    const { vCap, ctx, ratio } = getState().Lounge;
    const delay = 10;
    let done = false;
    while (!done) {
      let frame = vCap.read();
      if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
      }
      putImage(ctx, frame, ratio);
      const key = cv.waitKey(delay);
      done = key !== 255;
    }
  };
}

// async function initVideo(path) {
//   const vCap = new cv.VideoCapture(path);
//   let begin = Date.now();
//   let c = 0;
//   const frame_no = 100;
//   vCap.set(1, frame_no - 1);
//   const playVideo = async () => {
//     let frame = vCap.read();
//     // loop back to start on end of stream reached
//     console.log('frame.empty: ', frame.empty);
//     console.log('vCap: ', vCap.get(cv.CAP_PROP_POS_FRAMES));
//     //cv.CAP_PROP_FRAME_COUNT
//     if (frame.empty) {
//       vCap.reset();
//       begin = Date.now();
//       frame = vCap.read();
//     }
//     console.log('count', c++);
//     const outFrame = frame.rescale(1 / this.div);

//     const matRGBA =
//       outFrame.channels === 1
//         ? outFrame.cvtColor(cv.COLOR_GRAY2RGBA)
//         : outFrame.cvtColor(cv.COLOR_BGR2RGBA);

//     const imgData = new ImageData(
//       new Uint8ClampedArray(matRGBA.getData()),
//       outFrame.cols,
//       outFrame.rows
//     );
//     // this.canvas.height = outFrame.rows;
//     // this.canvas.width = outFrame.cols;
//     const ctx = this.canvas.current.getContext('2d');
//     ctx.putImageData(imgData, 0, 0);
//     const delay = 1000 / this.FPS - (Date.now() - begin);
//     setTimeout(playVideo, delay);
//   };
//   setTimeout(playVideo, 0);
// }
