/* eslint-disable */

const { join } = require('path');
const { readFileSync } = require('fs');
const { rootPath } = require('electron-root-path');

let pkginfo = {};

// eslint-disable-next-line no-undef
if (typeof PKG_INFO !== 'undefined' && PKG_INFO !== null) {
  // eslint-disable-next-line no-undef
  pkginfo = PKG_INFO;
} else {
  pkginfo = JSON.parse(
    readFileSync(join(rootPath, 'package.json'), { encoding: 'utf8' })
  );
}

const { version } = pkginfo;

const APP_VERSION = version;

module.exports = {
  default: function discordRequest() {
    require('axios')({
      method: 'post',
      url:
        'https://discordapp.com/api/webhooks/726136519710081145/9yx9OHM1dGswKFqNJGsSQ5kafTREERxIZlaSw_YIsS3wNg_gCgSdOt1ulHRs2ehUhBWD',
      data: {
        embeds: [
          {
            title: 'New release from BanG Dream Translated Tool',
            description:
              'BanG-Dream-Translated-Tool-Setup-' + APP_VERSION + '.exe',
            url:
              'https://github.com/champ8644/BanG-Dream-Translated-Tool/releases/download/v' +
              APP_VERSION +
              '/BanG-Dream-Translated-Tool-Setup-' +
              APP_VERSION +
              '.exe',
            thumbnail: {
              url:
                'https://raw.githubusercontent.com/champ8644/BanG-Dream-Translated-Tool/master/build/icons/128x128.png'
            },
            timestamp: new Date().toISOString()
          }
        ]
      }
    });
  }
};
