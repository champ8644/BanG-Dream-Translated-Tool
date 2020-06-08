import { chunkCount, updateThumbnailInterval } from '../constants/config';

import message2UI from '../../../worker/message2UI';
import { testfindTextBubble } from '../matFunctions/findTextBubble';

// function trimPayload(payload) {
//   const { frame, index, process } = payload;
//   return {
//     frame,
//     index,
//     process
//   };
// }

let isLoopValid;
export function devalidLoungeLoop() {
  isLoopValid = false;
}

function nonBlockingLoop({
  beginFrame = 0,
  endFrame = 1e9,
  vCap,
  process,
  chunksize,
  callback,
  finished,
  index
}) {
  // eslint-disable-next-line no-console
  console.log({
    beginFrame,
    endFrame,
    vCap,
    process,
    chunksize,
    callback,
    finished,
    index
  });
  let i = beginFrame;
  isLoopValid = true;
  message2UI('begin-progress', {
    path: vCap.path,
    index,
    beginFrame,
    endFrame
  });
  let prevTime =
    new Date().getTime() + index * (updateThumbnailInterval / process);
  (function chunk() {
    const end = Math.min(i + chunksize, vCap.length);
    // let info;
    for (; i < end; i++) {
      if (!isLoopValid) break;
      callback(i);
    }
    message2UI('update-progress', {
      path: vCap.path,
      index,
      frame: i,
      beginFrame,
      endFrame
    });
    const now = new Date().getTime();
    // console.log('now: ', now, now - prevTime);
    if (now - prevTime > updateThumbnailInterval) {
      prevTime = now;
      // console.log('update Thumbnail');
      // message2UI('update-thumbnail', {
      //   path: vCap.path,
      //   info: trimPayload(info)
      // });
    }
    if (i >= vCap.length) finished(true);
    else if (!isLoopValid) finished(false);
    else setTimeout(chunk, 0);
  })();
}

// let outputLounge;
let prevRes = [];

export default function mainLounge({ vCap, start, end, index, process }) {
  return new Promise(resolve => {
    // outputLounge = [];
    const state = [];
    nonBlockingLoop({
      index,
      process,
      beginFrame: start,
      endFrame: end,
      vCap,
      chunksize: chunkCount,
      callback: frame => {
        const mat = vCap.getMat(frame);
        if (mat.empty) {
          isLoopValid = false;
          return;
        }
        // const rects = testfindTextBubble(mat, prevRes, state);
        // outputLounge = [...outputLounge, ...calcs];
        prevRes = testfindTextBubble(mat, prevRes, state, frame);
      },
      finished: async finished => {
        if (finished) {
          resolve(state);
          message2UI('finish-progress', { path: vCap.path });
        } else {
          message2UI('cancel-progress', { path: vCap.path });
        }
      }
    });
  });
}
