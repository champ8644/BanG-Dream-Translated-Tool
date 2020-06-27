/* eslint-disable */

const axios = require('axios');

axios({
  method: 'post',
  url:
    'https://discordapp.com/api/webhooks/726136519710081145/9yx9OHM1dGswKFqNJGsSQ5kafTREERxIZlaSw_YIsS3wNg_gCgSdOt1ulHRs2ehUhBWD',
  data: {
    embeds: [
      {
        title: 'Release notes from BanG-Dream-Translated-Tool',
        description: 'v1.15.15',
        url:
          'https://github.com/champ8644/BanG-Dream-Translated-Tool/releases/download/v1.15.15/BanG-Dream-Translated-Tool-Setup-1.15.15.exe',
        thumbnail: {
          url:
            'https://raw.githubusercontent.com/champ8644/BanG-Dream-Translated-Tool/master/build/icons/128x128.png'
        }
        // timestamp: 'June 27, 2020 at 11:04AM'
      }
    ]
  }
});
