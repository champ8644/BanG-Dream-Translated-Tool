/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies, import/no-self-import */

const { join } = require('path');
const { readFileSync } = require('fs');
const { rootPath } = require('electron-root-path');
const axios = require('axios');

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

const data = {
  EntryTitle: 'ตื่นนอนแล้วนอนต่อ',
  EntryUrl: 'https://ift.tt/2ZnuIb6',
  EntryAuthor: 'Facebook',
  EntryContent: 'Image + ตื่นนอนแล้วนอนต่อ',
  EntryImageUrl: 'https://ift.tt/2NLXOeR',
  EntryPublished: 'July 02, 2020 at 08:06AM',
  FeedTitle: 'Nep-A-Live - Posts | Facebook',
  FeedUrl: 'https://ift.tt/2CS3H7Z'
};

async function discordRequest() {
  const {
    EntryTitle,
    EntryUrl,
    EntryContent,
    EntryPublished,
    FeedTitle,
    EntryImageUrl,
    EntryAuthor
  } = data;
  try {
    await axios({
      method: 'post',
      url:
        'https://discordapp.com/api/webhooks/728069960206647306/JVnoso09QkQXd8M_B0VylKrGjzLqVQNCEEud_LcAtEO4T1cev-2IjsTNrwZseM-b3rON',
      data: {
        embeds: [
          {
            color: 3889560,
            author: { name: EntryAuthor },
            title: FeedTitle,
            description: EntryTitle,
            url: EntryUrl,
            image: { url: EntryImageUrl },
            footer: {
              text: EntryPublished
            }
          }
        ]
      }
    });
    console.log('done');
  } catch (error) {
    console.log('error: ' + error);
  }
}
module.exports = {
  default: discordRequest
};

discordRequest();
