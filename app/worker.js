import mainEvent, {
  devalidLoop
} from './containers/Lounge/mainFunctions/mainEvent';

import BiVideoCapture from './containers/Lounge/VideoCapture';
import electron from 'electron';
import mergeData from './containers/Lounge/mainFunctions/mergeData';
import writeAss from './containers/Lounge/mainFunctions/writeAss';

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
  const { videoFilePath, start, end, uuid, index, process } = arg;
  const vCap = new BiVideoCapture({ path: videoFilePath });
  const res = await mainEvent({ vCap, start, end, index, process });
  ipcRenderer.send(uuid, res);
});

ipcRenderer.on('sum-events', (e, payload) => {
  if (payload[0].finished) {
    writeAss(mergeData(payload));
    message2UI('finish-progress', { path: payload[0].info.path });
  } else message2UI('cancel-progress', { path: payload[0].info.path });
});
