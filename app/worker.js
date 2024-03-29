import mainEvent, {
  devalidLoop
} from './containers/Lounge/mainFunctions/mainEvent';
import mainLounge, {
  devalidLoungeLoop
} from './containers/Lounge/loungeFunctions/mainLounge';

import BiVideoCapture from './containers/Lounge/BiVideoCapture';
import VideoCapture from './containers/Lounge/VideoCapture';
import adapterLounge from './containers/Lounge/loungeFunctions/adapterLounge';
import electron from 'electron';
import mergeData from './containers/Lounge/mainFunctions/mergeData';
import writeAss from './containers/Lounge/mainFunctions/writeAss';
import writeLounge from './containers/Lounge/loungeFunctions/writeLounge';

const { ipcRenderer } = electron;

// eslint-disable-next-line no-unused-vars
function message2UI(command, payload) {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
}

ipcRenderer.on('stop-events', () => {
  if (devalidLoop) devalidLoop();
  if (devalidLoungeLoop) devalidLoungeLoop();
});

ipcRenderer.on('start-events', async (e, arg) => {
  const { videoFilePath, start, end, uuid, index, process } = arg;
  const vCap = new BiVideoCapture({ path: videoFilePath });
  const res = await mainEvent({ vCap, start, end, index, process });
  ipcRenderer.send(uuid, res);
});

ipcRenderer.on('start-lounge', async (e, arg) => {
  const { videoFilePath, start, end, index, process } = arg;
  const vCap = new VideoCapture({ path: videoFilePath });
  const { res, finished } = await mainLounge({
    vCap,
    start,
    end,
    index,
    process
  });
  if (finished) {
    const assPath = writeLounge({ data: adapterLounge(res), vCap });
    message2UI('finish-progress', { path: vCap.path, assPath });
  } else {
    message2UI('cancel-progress', { path: vCap.path });
  }
});

ipcRenderer.on('ask-type', async (e, arg) => {
  const { path } = arg;
  const vCap = new VideoCapture({ path });
  const isEvent = vCap.findTypeEvent();
  message2UI('answer-type', { path, isEvent });
});

ipcRenderer.on('sum-events', async (e, payload) => {
  if (payload[0].finished) {
    const assPath = await writeAss(mergeData(payload));
    message2UI('finish-progress', { path: payload[0].info.path, assPath });
  } else message2UI('cancel-progress', { path: payload[0].info.path });
});
