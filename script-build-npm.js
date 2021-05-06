const argv = require('yargs').argv;
const chalk = require('chalk');

const build = require('./script-build-utils');

// create a local copy of the library to be published
console.log(chalk.blue(`
  ____            _               ____            _                 
 |  _ \\  ___  ___(_) __ _ _ __   / ___| _   _ ___| |_ ___ _ __ ___  
 | | | |/ _ \\/ __| |/ _\` | '_ \\  \\___ \\| | | / __| __/ _ \\ '_ \` _ \\ 
 | |_| |  __/\\__ \\ | (_| | | | |  ___) | |_| \\__ \\ ||  __/ | | | | |
 |____/ \\___||___/_|\\__, |_| |_| |____/ \\__, |___/\\__\\___|_| |_| |_|  (npm)
                    |___/               |___/
`));

build({
  env: argv.env,
  buildFiles: ['script-build-npm.js'],
  skipBuild: false,
  target: 'library-npm'
});
