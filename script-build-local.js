const argv = require('yargs').argv;
const chalk = require('chalk');
const lockfile = require('proper-lockfile');

const build = require('./script-build-utils');

// create a local copy of the library source files without node_modules so that it can be installed locally
console.log(chalk.blue(`
  ____            _               ____            _                 
 |  _ \\  ___  ___(_) __ _ _ __   / ___| _   _ ___| |_ ___ _ __ ___  
 | | | |/ _ \\/ __| |/ _\` | '_ \\  \\___ \\| | | / __| __/ _ \\ '_ \` _ \\ 
 | |_| |  __/\\__ \\ | (_| | | | |  ___) | |_| \\__ \\ ||  __/ | | | | |
 |____/ \\___||___/_|\\__, |_| |_| |____/ \\__, |___/\\__\\___|_| |_| |_|  (local)
                    |___/               |___/
`));

const lockfilePath = 'script-build-local';
lockfile.lock(lockfilePath, {realpath: false, retries: 5})
  .then(release => {
    build({
      env: argv.env,
      buildFiles: ['script-build-local.js'],
      skipBuild: true,
      target: 'library-local'
    });

    release();
  })
  .catch(e => {
    console.error(chalk.red('[uik] error updating library-local'), e);
  });
