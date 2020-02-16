const electron = require('electron');

const { ipcRenderer } = electron;

function message2UI(command, payload) {
  ipcRenderer.send('message-from-worker', {
    command,
    payload
  });
}

ipcRenderer.on('message-from-renderer', (e, arg) => {
  // eslint-disable-next-line no-console
  console.log('recieve msg from renderer', arg);
  // eslint-disable-next-line no-alert
  alert(JSON.stringify(arg));
  message2UI('sendback', arg);
});
