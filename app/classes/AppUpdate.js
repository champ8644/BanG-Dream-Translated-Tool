'use strict';

import { BrowserWindow, dialog } from 'electron';

import { ENABLE_BACKGROUND_AUTO_UPDATE } from '../constants';
import { PATHS } from '../utils/paths';
import { autoUpdater } from 'electron-updater';
import { getMainWindow } from '../utils/createWindows';
import { isConnected } from '../utils/isOnline';
import { isPackaged } from '../utils/isPackaged';
import { log } from '../utils/log';
import { undefinedOrNull } from '../utils/funcs';
import { unixTimestampNow } from '../utils/date';

let progressbarWindow = null;
let mainWindow = null;

const createChildWindow = () => {
  try {
    return new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false,
      height: 150,
      width: 600,
      title: 'Progress...',
      resizable: false,
      minimizable: true,
      maximizable: false,
      fullscreenable: false,
      movable: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
  } catch (e) {
    log.error(e, `AppUpdate -> createChildWindow`);
  }
};

const fireProgressbar = () => {
  try {
    if (progressbarWindow) {
      progressbarWindow.show();
      progressbarWindow.focus();
      return null;
    }

    progressbarWindow = createChildWindow();
    progressbarWindow.loadURL(`${PATHS.loadUrlPath}#progressbarPage`);

    progressbarWindow.webContents.on('did-finish-load', () => {
      progressbarWindow.show();
      progressbarWindow.focus();
    });

    progressbarWindow.on('closed', () => {
      progressbarWindow = null;
    });

    progressbarWindow.onerror = error => {
      log.error(error, `AppUpdate -> progressbarWindow -> onerror`);
    };
  } catch (e) {
    log.error(e, `AppUpdate -> fireProgressbar`);
  }
};

export default class AppUpdate {
  constructor() {
    this.autoUpdater = autoUpdater;
    if (!isPackaged) {
      this.autoUpdater.updateConfigPath = PATHS.appUpdateFile;
    }
    this.autoUpdater.autoDownload = ENABLE_BACKGROUND_AUTO_UPDATE;
    this.domReadyFlag = null;
    this.updateInitFlag = false;
    this.updateForceCheckFlag = false;
    this._errorDialog = {
      timeGenerated: 0,
      title: null,
      message: null
    };
    this.updateIsActive = 0; // 0 = no, 1 = update check in progress, -1 = update in progress
    this.disableAutoUpdateCheck = false;
  }

  init() {
    try {
      if (this.updateInitFlag) {
        return;
      }

      this.autoUpdater.on('error', error => {
        const errorMsg =
          error == null ? 'unknown' : (error.stack || error).toString();

        if (progressbarWindow !== null) {
          progressbarWindow.close();
        }
        this.closeActiveUpdates();

        if (this.isNetworkError(error)) {
          this.spitMessageDialog(
            'Update Error',
            'Oops.. A network error occured. Try again!',
            'error'
          );
          log.doLog(error);

          return null;
        }

        this.spitMessageDialog(
          'Update Error',
          'Oops.. Some error occured while updating the app. Try again!',
          'error'
        );

        log.error(errorMsg, `AppUpdate -> onerror`);
      });

      this.autoUpdater.on('update-available', () => {
        if (progressbarWindow !== null && this.updateIsActive !== -1) {
          progressbarWindow.close();
        }

        dialog
          .showMessageBox({
            type: 'info',
            title: 'Updates Found',
            message: 'New version available. Update the app now?',
            buttons: ['Yes', 'No']
          })
          .then(buttonIndex => {
            switch (buttonIndex) {
              case 0:
                if (progressbarWindow !== null) {
                  progressbarWindow.close();
                }
                this.closeActiveUpdates(-1);
                this.initDownloadUpdatesProgress();

                this.autoUpdater.downloadUpdate();
                break;
              default:
              case 1:
                if (this.updateIsActive !== -1) {
                  this.closeActiveUpdates();
                }
                break;
            }
            return null;
          })
          .catch(() => {});
      });

      this.autoUpdater.on('download-progress', progress => {
        if (progressbarWindow === null) {
          return null;
        }

        this.setUpdateProgressWindow({ value: progress.percent || 0 });
      });

      this.autoUpdater.on('update-downloaded', () => {
        this.closeActiveUpdates();
        if (progressbarWindow !== null) {
          progressbarWindow.close();
        }

        dialog
          .showMessageBox({
            title: 'Install Updates',
            message: 'Updates downloaded. Application will quit now...',
            buttons: ['Install and Relaunch']
          })
          .then(buttonIndex => {
            switch (buttonIndex) {
              case 0:
              default:
                this.autoUpdater.quitAndInstall();
                break;
            }
            return null;
          })
          .catch(() => {});
      });

      this.updateInitFlag = true;
    } catch (e) {
      log.error(e, `AppUpdate -> init`);
    }
  }

  checkForUpdates() {
    try {
      this.setMainWindow();

      if (!mainWindow) {
        return;
      }

      isConnected()
        .then(connected => {
          if (!connected) {
            return null;
          }

          if (this.updateIsActive === 1 || this.disableAutoUpdateCheck) {
            return null;
          }

          this.autoUpdater.on('update-not-available', () => {
            this.updateIsActive = 0;
          });

          this.autoUpdater.checkForUpdates();
          this.updateIsActive = 1;
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> checkForUpdates`);
    }
  }

  forceCheck() {
    try {
      this.setMainWindow();

      if (!mainWindow) {
        return;
      }

      if (!this.updateForceCheckFlag && this.updateIsActive !== 1) {
        this.autoUpdater.on('checking-for-update', () => {
          this.setCheckUpdatesProgress();
        });

        this.autoUpdater.on('update-not-available', () => {
          // an another 'update-not-available' event is registered at checkForUpdates() as well
          this.closeActiveUpdates();

          if (progressbarWindow !== null) {
            progressbarWindow.close();
          }
          dialog
            .showMessageBox({
              title: 'No Updates Found',
              message: 'You have the latest version installed.',
              buttons: ['Close']
            })
            .then(buttonIndex => {
              switch (buttonIndex) {
                case 0:
                default:
                  break;
              }
              return null;
            })
            .catch(() => {});
        });
      }

      if (this.updateIsActive === 1) {
        return null;
      }

      if (this.updateIsActive === -1) {
        dialog
          .showMessageBox({
            title: 'Update in progress',
            message:
              'Another update is in progess. Are you sure want to restart the update?',
            buttons: ['Yes', 'No']
          })
          .then(buttonIndex => {
            switch (buttonIndex) {
              case 0:
                this.autoUpdater.checkForUpdates();
                this.updateIsActive = -1;
                break;
              case 1:
              default:
                break;
            }
            return null;
          })
          .catch(() => {});
        return null;
      }

      this.autoUpdater.checkForUpdates();
      this.updateForceCheckFlag = true;
      this.disableAutoUpdateCheck = true;
      this.updateIsActive = 1;
    } catch (e) {
      log.error(e, `AppUpdate -> forceCheck`);
    }
  }

  setCheckUpdatesProgress() {
    try {
      isConnected()
        .then(connected => {
          if (!connected) {
            this.spitMessageDialog(
              'Checking For Updates',
              'Internet connection is unavailable.'
            );
            return null;
          }

          fireProgressbar();
          this.setTaskBarProgressBar(2);

          progressbarWindow.webContents.once('dom-ready', () => {
            progressbarWindow.webContents.send('progressBarDataCommunication', {
              progressTitle: `Checking For Updates`,
              progressBodyText: `Please wait...`,
              value: 0,
              variant: `indeterminate`
            });
          });
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> setCheckUpdatesProgress`);
    }
  }

  initDownloadUpdatesProgress() {
    try {
      isConnected()
        .then(connected => {
          if (!connected) {
            this.spitMessageDialog(
              'Downloading Updates',
              'Internet connection is unavailable.'
            );
            return null;
          }

          fireProgressbar();

          this.domReadyFlag = false;
          this.setUpdateProgressWindow({ value: 0 });
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> initDownloadUpdatesProgress`);
    }
  }

  setUpdateProgressWindow({ value = 0 }) {
    try {
      const data = {
        progressTitle: `Downloading Updates`,
        progressBodyText: `Please wait...`,
        value,
        variant: `determinate`
      };

      this.setTaskBarProgressBar(value / 100);
      if (this.domReadyFlag) {
        progressbarWindow.webContents.send(
          'progressBarDataCommunication',
          data
        );
        return null;
      }

      progressbarWindow.webContents.once('dom-ready', () => {
        progressbarWindow.webContents.send(
          'progressBarDataCommunication',
          data
        );

        this.domReadyFlag = true;
      });
    } catch (e) {
      log.error(e, `AppUpdate -> setUpdateProgressWindow`);
    }
  }

  setMainWindow() {
    const _mainWindow = getMainWindow();
    if (undefinedOrNull(_mainWindow)) {
      return null;
    }

    mainWindow = _mainWindow;
  }

  setTaskBarProgressBar(value) {
    try {
      mainWindow.setProgressBar(value);
    } catch (e) {
      log.error(e, `AppUpdate -> setTaskBarProgressBar`);
    }
  }

  isNetworkError(errorObj) {
    return (
      errorObj.message === 'net::ERR_INTERNET_DISCONNECTED' ||
      errorObj.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
      errorObj.message === 'net::ERR_CONNECTION_RESET' ||
      errorObj.message === 'net::ERR_CONNECTION_CLOSE' ||
      errorObj.message === 'net::ERR_NAME_NOT_RESOLVED' ||
      errorObj.message === 'net::ERR_CONNECTION_TIMED_OUT'
    );
  }

  spitMessageDialog(title, message, type = 'message') {
    const { timeGenerated: _timeGenerated } = this._errorDialog;
    const delayTime = 1000;

    if (
      _timeGenerated !== 0 &&
      _timeGenerated - unixTimestampNow() < delayTime
    ) {
      return null;
    }

    this._errorDialog = {
      timeGenerated: unixTimestampNow(),
      title,
      message
    };

    switch (type) {
      default:
      case 'message':
        dialog
          .showMessageBox({
            title,
            message,
            buttons: ['Close']
          })
          .then(buttonIndex => {
            switch (buttonIndex) {
              case 0:
              default:
                break;
            }
            return null;
          })
          .catch(() => {});
        break;
      case 'error':
        dialog.showErrorBox(title, message);
        break;
    }
  }

  closeActiveUpdates(updateIsActive = 0) {
    this.setTaskBarProgressBar(-1);
    this.updateIsActive = updateIsActive;
  }
}
