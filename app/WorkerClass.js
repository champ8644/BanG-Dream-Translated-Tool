import { BrowserWindow } from 'electron';
import { PATHS } from './utils/paths';
import { log } from './utils/log';

const numWorker = 4;

export default class WorkerClass {
  constructor() {
    this.workerWindows = Array.from(Array(numWorker), (x, index) => {
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

  sendMessage(arg) {
    const { command, payload } = arg;
    switch (command) {
      case 'start-events': {
        const { videoFilePath, timeLimit } = payload;
        const batch = Math.round(timeLimit / numWorker);
        this.workerWindows.forEach((window, index) =>
          window.webContents.send('start-events', {
            videoFilePath,
            start: batch * index,
            end: batch * (index + 1)
          })
        );
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
