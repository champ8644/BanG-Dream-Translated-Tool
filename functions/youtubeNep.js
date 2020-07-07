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
  EntryAuthor: 'tah10270',
  EntryContent: '(none)',
  EntryImageUrl: 'http://ifttt.com/images/no_image_card.png',
  EntryPublished: 'July 02, 2020 at 01:34PM',
  EntryTitle:
    'Bang Dream : การ์ด Railgun Arisa 4★ ท่านพี่ขาอันตัวข้าอาริสะขอตามติดไปชั่วชีวิต',
  EntryUrl: 'https://www.youtube.com/watch?v=TckSvw-F-0c',
  FeedTitle: 'tah10270',
  FeedUrl: 'https://www.youtube.com/channel/UCtmSyLZO2E9uT7oPpzTkQ4A'
};

async function discordRequest() {
  const {
    EntryTitle,
    EntryUrl,
    EntryContent,
    EntryPublished,
    FeedTitle,
    EntryImageUrl,
    EntryAuthor,
    FeedUrl
  } = data;
  try {
    await axios({
      method: 'post',
      url:
        'https://discordapp.com/api/webhooks/728086818779824160/TpWg7kSUzzKyQm-FT5QlpjYnaUqv9a8lXTO6mHSfKD87WaxJektSw55YRhLLjLwzeWjc',
      data: {
        content: EntryUrl
        // embeds: [
        //   {
        //     color: 3889560,
        //     author: { name: 'Youtube' },
        //     title: FeedTitle,
        //     description: EntryTitle,
        //     url: EntryUrl,
        //     image: { url: EntryImageUrl },
        //     content: EntryContent,
        //     footer: {
        //       text: EntryPublished
        //     }
        //   }
        // ]
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
