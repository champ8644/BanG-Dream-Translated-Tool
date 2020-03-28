import electron from 'electron';

const { ipcRenderer } = electron;

export default function message2UI(command, payload) {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
}
