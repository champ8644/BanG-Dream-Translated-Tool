import { ipcRenderer } from 'electron';

export function message2Worker(command, payload) {
  ipcRenderer.send('message-from-renderer', {
    command,
    payload
  });
}

ipcRenderer.on('message-from-worker', (e, arg) => {
  // eslint-disable-next-line no-console
  console.log('recieve msg from worker', arg);
  // eslint-disable-next-line no-alert
});
