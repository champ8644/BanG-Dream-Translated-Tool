module.exports = {
  default: function afterHooks() {
    const execSync = require('child_process').execSync;
    // execSync('yarn patch', { encoding: 'utf-8' });
    // console.log('process.env.SHUTDOWN: ', process.env.SHUTDOWN);
    execSync('shutdown -s -t 300', { encoding: 'utf-8' });
  }
};
