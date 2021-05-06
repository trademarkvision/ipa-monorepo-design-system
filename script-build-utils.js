const chalk = require('chalk');
const diff = require('diff');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const glob = require('glob');
const insert = require('gulp-insert');
const objectHash = require('object-hash');
const path = require('path');
const sort = require('gulp-sort');
const vinylFs = require('vinyl-fs');
const vinylFsConcat = require('vinyl-fs-concat');
const vinylMap = require('vinyl-map');

module.exports = function build(options) {
  options = {
    ...options,
    env: (options.env || 'production'),
    buildFiles: [
      'fonts/**',
      'images/**',
      'src/**',
      'styles/**',
      'internal/**',
      '.browserslistrc',
      'babel.config.js',
      'package.json',
      'postcss.config.js',
      'script-build-utils.js',
      'tsconfig.json',
      'vue.config.js',
      ...options.buildFiles
    ]
  };

  let changedLines = null;

  checkNeedsBuild()
    .then(buildIfNeeded)
    .then(updateLibraryTarget)
    .then(updateBuildHash)
    .catch(err => console.error(chalk.red('[uik] err'), err));

  function checkNeedsBuild() {
    return new Promise(resolve => {
      log('checking if it needs to build...');

      changedLines = null;
      const stream = hashStream(options.buildFiles, 'build.hash', options.env)
        .pipe(vinylMap(stream => compareHashes(`../${options.target}/build.hash`, stream)));

      stream.on('end', () => {
        if (!changedLines) {
          log('has not been built yet');
          resolve(true);
        } else if (changedLines.length > 0) {
          log(`${changedLines.length} change${changedLines.length !== 1 ? 's' : ''} detected`);
          resolve(true);
        } else {
          log('no changes detected');
          resolve(false);
        }
      });

      stream.on('error', err => {
        log('error while checking', err);
        resolve(true);
      });
    });
  }

  function buildIfNeeded(needsBuild) {
    return new Promise(resolve => {
      if (!needsBuild) {
        resolve(false);
        return;
      }

      if (!options.skipBuild) {
        log('building...');
        fs.removeSync('build/lib');

        execSync('vue-cli-service build --no-clean --target lib --formats commonjs --name ipa-design-system ./src/library.ts', {stdio: 'inherit'});

        log('done building');
      }

      resolve(true);
    });
  }

  function updateLibraryTarget(built) {
    return new Promise(resolve => {
      if (!built) {
        resolve(false);
        return;
      }

      log(`updating ${options.target}...`);

      if (!options.skipBuild) {
        fs.removeSync('dist');

        // copy the typescript definitions to dist
        fs.copySync('build/ts/library.d.ts', 'dist/ipa-design-system.common.d.ts');
        fs.copySync('build/ts/models.d.ts', 'dist/models.d.ts');

        fs.removeSync('dist/components');
        fs.copySync('build/ts/components', 'dist/components');

        fs.removeSync('dist/utils');
        fs.copySync('build/ts/utils', 'dist/utils');

        fs.removeSync('dist/models');
        fs.copySync('build/ts/models', 'dist/models');

        fs.removeSync('dist/views');
        fs.copySync('build/ts/views', 'dist/views');

        // copy the library files to dist
        fs.copySync('build/lib/ipa-design-system.common.js', 'dist/ipa-design-system.common.js');
        fs.copySync('build/lib/ipa-design-system.css', 'dist/ipa-design-system.css');

        // copy global files to dist
        fs.copySync('src/globals', 'dist/globals');
      }

      // create a local copy of the target library
      fs.removeSync(`../${options.target}`);

      // prepare package.json for local target
      const packageJson = require('./package');
      for (const key in packageJson.targets[options.target]) {
        packageJson[key] = packageJson.targets[options.target][key];
      }
      delete packageJson.targets;

      let map = packageJson.files.map(x => glob.sync(x));
      let empty = [];
      map.forEach(x => x.forEach(xx => empty.push(xx)));
      empty.filter(x => !x.includes('/stories'))
        .forEach(x => fs.copySync(x, path.join(`../${options.target}`, x)));
      fs.writeFileSync(path.join(`../${options.target}`, 'package.json'), JSON.stringify(packageJson, null, 2));

      log(`done updating ${options.target}`);
      resolve(true);
    });
  }

  function updateBuildHash(built) {
    return new Promise(resolve => {
      if (!built) {
        resolve(false);
        return;
      }

      log('updating build.hash...');
      const stream = hashStream(options.buildFiles, 'build.hash', options.env)
        .pipe(vinylFs.dest(`../${options.target}`));

      stream.on('end', () => {
        log('done updating build.hash');
        resolve(true);
      });

      stream.on('error', err => {
        log('error updating build.hash', err);
        resolve(false);
      });
    });
  }

  function hashStream(input, output, env) {
    return vinylFs.src(input)
      .pipe(vinylMap((stream, filename) => `${path.relative(__dirname, filename)}: ${objectHash(stream.toString())}`))
      .pipe(sort())
      .pipe(vinylFsConcat(output))
      .pipe(insert.prepend(env ? `env: ${env}\n` : ''));
  }

  function compareHashes(oldHashFilename, newHashStream) {
    try {
      const oldHash = fs.readFileSync(oldHashFilename, 'utf8');
      const newHash = newHashStream.toString();
      changedLines = diff.diffTrimmedLines(oldHash, newHash)
        .filter(x => (x.added || x.removed))
        .map(x => x.value);
    } catch (err) {
      changedLines = null;
    }
  }

  function log(...args) {
    console.log.apply(console, [chalk.blue('[uik]'), ...args]);
  }
};
