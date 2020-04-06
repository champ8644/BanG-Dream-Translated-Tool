import { BrowserWindow, ipcMain } from 'electron';

import { PATHS } from './utils/paths';
import { log } from './utils/log';
import { v4 as uuidv4 } from 'uuid';

export default class WorkerClass {
  constructor() {
    this.waiting = [];
    this.workerWindows = [this.openNewWindow(0)];
  }

  openNewWindow(index) {
    return new Promise(resolve => {
      const window = new BrowserWindow({
        title: `Worker window ${index}`,
        show: false,
        webPreferences: { nodeIntegration: true }
      });
      window.loadURL(`${PATHS.loadWorkerUrlPath}`);
      window.webContents.on('did-finish-load', () => {
        if (!window) {
          throw new Error(`"window${index}" is not defined`);
        }
      });
      window.webContents.on('did-finish-load', () => {
        if (!window) throw new Error(`"window${index}" is not defined`);
        resolve(window);
      });
      window.onerror = error => {
        log.error(error, `main.dev -> window${index} -> onerror`);
      };
      window.on('closed', () => {
        this.workerWindows[index] = null;
      });
    });
  }

  async startEvents(payload) {
    const { videoFilePath, start, end, process } = payload;
    const invokeWindows = [];
    for (let i = 0; i < process; i++)
      invokeWindows[i] = this.workerWindows[i]
        ? this.workerWindows[i]
        : this.openNewWindow(i);
    this.workerWindows = await Promise.all(invokeWindows);
    const batch = Math.round((end - start) / process);
    this.workerWindows.forEach((window, index) => {
      const uuid = uuidv4();
      window.webContents.send('start-events', {
        videoFilePath,
        start: start + batch * index,
        end: start + batch * (index + 1),
        uuid,
        index
      });
      this.waiting[index] = new Promise(resolve => {
        ipcMain.once(uuid, (e, arg) => resolve(arg));
      });
    });
    this.workerWindows[0].webContents.send(
      'sum-events',
      await Promise.all(this.waiting)
    );
    for (let i = 1; i < process; i++) this.workerWindows[i].close();
  }

  sendMessage(arg) {
    const { command, payload } = arg;
    switch (command) {
      case 'start-events': {
        this.startEvents(payload);
        break;
      }
      case 'stop-events':
        this.workerWindows.forEach(window =>
          window.webContents.send('stop-events')
        );
        break;
      default:
    }
  }

  close() {
    this.workerWindows.forEach(window => window.close());
    this.workerWindows = null;
  }
}
