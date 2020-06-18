function afterHooks() {
  const execSync = require('child_process').execSync;
  execSync('yarn patch', { encoding: 'utf-8' });
  execSync('shutdown -s -t 60', { encoding: 'utf-8' });
  console.log('going to shutdown');
}

afterHooks();
