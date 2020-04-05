import { BrowserWindow, ipcMain } from 'electron';

import { NUM_WORKER_PROCESS } from './constants';
import { PATHS } from './utils/paths';
import { log } from './utils/log';
import { v4 as uuidv4 } from 'uuid';

export default class WorkerClass {
  constructor() {
    this.waiting = [];
    this.workerWindows = Array.from(Array(NUM_WORKER_PROCESS), (x, index) => {
      let window = new BrowserWindow({
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
        if (!window) {
          throw new Error(`"window${index}" is not defined`);
        }
      });
      window.onerror = error => {
        log.error(error, `main.dev -> window${index} -> onerror`);
      };
      window.on('closed', () => {
        window = null;
      });
      return window;
    });
  }

  async startEvents(payload) {
    const { videoFilePath, start, end } = payload;
    const batch = Math.round((end - start) / NUM_WORKER_PROCESS);
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
