import mainEvent, {
  devalidLoop
} from './containers/Lounge/mainFunctions/mainEvent';

import VideoCapture from './containers/Lounge/VideoCapture';
import electron from 'electron';
import mergeData from './containers/Lounge/mainFunctions/mergeData';

const { ipcRenderer } = electron;

// eslint-disable-next-line no-unused-vars
function message2UI(command, payload) {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
}

ipcRenderer.on('stop-events', devalidLoop);

ipcRenderer.on('start-events', async (e, arg) => {
  const { videoFilePath, start, end, uuid, index } = arg;
  const vCap = new VideoCapture({ path: videoFilePath });
  const res = await mainEvent({ vCap, start, end, index });
  ipcRenderer.send(uuid, res);
});

ipcRenderer.on('sum-events', async (e, payload) => {
  const data = await mergeData(payload);
  // eslint-disable-next-line no-console
  console.log('data: ', data);
  message2UI('finish-progress');
});
