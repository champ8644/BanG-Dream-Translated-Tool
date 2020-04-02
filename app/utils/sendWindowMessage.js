export const sendWindowMessage = (targetWindow, message, payload) => {
  if (typeof targetWindow === 'undefined') {
    return Error('Target window does not exist');
  }
  targetWindow.webContents.send(message, payload);
};
