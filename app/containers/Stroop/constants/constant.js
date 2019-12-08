export const time = {
  preX: 500,
  X: 250,
  postX: 100,
  // interval: 2000,
  answer: 500
};

export const hotkey = [
  { key: 'v', color: 'blue' },
  { key: 'b', color: 'red' },
  { key: 'n', color: 'yellow' },
  { key: 'm', color: 'green' }
];

export const hotkeyString = hotkey.map(x => x.key).join(',');
