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

ipcRenderer.on('message-from-renderer', (e, arg) => {
  const { command, payload } = arg;
  switch (command) {
    case 'start-events':
      mainEvents(payload);
      break;
    default:
  }
});
