import { devalidLoop } from './containers/Lounge/mainFunctions/mainEvent';
import electron from 'electron';
import mainEvents from './worker/mainEvents';

const { ipcRenderer } = electron;

// eslint-disable-next-line no-unused-vars
function message2UI(command, payload) {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
}

ipcRenderer.on('start-events', (e, arg) => mainEvents(e, arg));
ipcRenderer.on('stop-events', () => devalidLoop());
