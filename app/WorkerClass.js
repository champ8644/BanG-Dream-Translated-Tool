import { BrowserWindow, ipcMain } from 'electron';

import { PATHS } from './utils/paths';
import { log } from './utils/log';
import { v4 as uuidv4 } from 'uuid';

export default class WorkerClass {
  constructor() {
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

  closeWindows() {
    for (let i = 1; i < this.workerWindows.length; i++) {
      if (this.workerWindows[i]) this.workerWindows[i].close();
    }
  }

  waitForClosing() {
    this.isWorking = false;
    setTimeout(() => {
      if (!this.isWorking) this.closeWindows();
    }, 10000);
  }

  async startLounge(payload) {
    const { videoFilePath, start, end, process } = payload;
    const invokeWindows = [];
    let i = 0;
    for (; i < process; i++)
      invokeWindows[i] = this.workerWindows[i]
        ? this.workerWindows[i]
        : this.openNewWindow(i);
    for (; i < this.workerWindows.length; i++) {
      if (this.workerWindows[i]) this.workerWindows[i].close();
    }
    this.workerWindows = await Promise.all(invokeWindows);
    this.workerWindows[0].webContents.send('start-lounge', {
      videoFilePath,
      start,
      end,
      process,
      index: 0
    });
  }

  async askType(payload) {
    const { path } = payload;
    const invokeWindows = [];
    let i = 0;
    for (; i < 1; i++)
      invokeWindows[i] = this.workerWindows[i]
        ? this.workerWindows[i]
        : this.openNewWindow(i);
    for (; i < this.workerWindows.length; i++) {
      if (this.workerWindows[i]) this.workerWindows[i].close();
    }
    this.workerWindows = await Promise.all(invokeWindows);
    this.workerWindows[0].webContents.send('ask-type', {
      path
    });
  }

  async startEvents(payload) {
    const { videoFilePath, start, end, process } = payload;
    const waiting = [];
    const invokeWindows = [];
    let i = 0;
    for (; i < process; i++)
      invokeWindows[i] = this.workerWindows[i]
        ? this.workerWindows[i]
        : this.openNewWindow(i);
    for (; i < this.workerWindows.length; i++) {
      if (this.workerWindows[i]) this.workerWindows[i].close();
    }
    this.workerWindows = await Promise.all(invokeWindows);
    const batch = Math.round((end - start) / process);
    this.workerWindows.forEach((window, index) => {
      const uuid = uuidv4();
      window.webContents.send('start-events', {
        videoFilePath,
        start: start + batch * index,
        end: start + batch * (index + 1),
        uuid,
        index,
        process
      });
      waiting[index] = new Promise(resolve => {
        ipcMain.once(uuid, (e, arg) => resolve(arg));
      });
    });
    this.workerWindows[0].webContents.send(
      'sum-events',
      await Promise.all(waiting)
    );
  }

  async sendMessage(arg) {
    const { command, payload } = arg;
    switch (command) {
      case 'start-events': {
        this.isWorking = true;
        await this.startEvents(payload);
        break;
      }
      case 'start-lounge': {
        this.isWorking = true;
        await this.startLounge(payload);
        break;
      }
      case 'stop-events':
        this.workerWindows.forEach(window => {
          if (window)
            if (window.webContents) window.webContents.send('stop-events');
        });
        break;
      case 'ask-type':
        this.askType(payload);
        break;
      default:
    }
    this.waitForClosing();
  }

  close() {
    this.workerWindows.forEach(window => window.close());
    this.workerWindows = null;
  }
}
