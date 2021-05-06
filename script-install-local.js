const argv = require('yargs').argv;
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const targetBase = path.resolve('../../', argv.target);
const target = path.resolve(targetBase, '@uik');

console.log(chalk.blue('[uik]'), `installing design system to ${targetBase}...`);

fs.removeSync(target);
fs.copySync('../library-local', target, {
  // make sure these are not in the design system folder
  filter: (src, dest) => {
    if (src.match(/package\.json$/) || src.match(/build\.hash$/)) {
      return false;
    }

    return true;
  }
});

console.log(chalk.blue('[uik]'), `verifying peer dependencies...`);

const libraryPackageJson = require('./package');
const allRequired = libraryPackageJson.peerDependencies;

const targetPackageJson = require(path.resolve(targetBase, 'package.json'));
const allInstalled = {
  ...targetPackageJson.devDependencies,
  ...targetPackageJson.dependencies
};

const missing = [];
const unsatisfied = [];
for (const name in allRequired) {
  const required = allRequired[name];
  const installed = allInstalled[name];

  if (!installed) {
    missing.push(`${name}@${required}`);
  } else if (required.startsWith('https://') && installed !== required) {
    unsatisfied.push(`${name}@${required} (installed is ${installed})`);
  } else if (!required.startsWith('https://') && !semver.satisfies(installed, required)) {
    unsatisfied.push(`${name}@${required} (installed is ${installed})`);
  }
}

if (missing.length > 0) {
  console.error(chalk.red(`[uik] ${missing.length} missing peer ${missing.length === 1 ? 'dependency' : 'dependencies'}:`));
  missing.forEach(x => console.error(chalk.red(`  ${x}`)));
  throw new Error('[uik] there are some missing peer dependencies (see above)');
}

if (unsatisfied.length > 0) {
  console.log(chalk.yellow(`[uik] ${unsatisfied.length} unsatisfied peer ${unsatisfied.length === 1 ? 'dependency' : 'dependencies'}:`));
  unsatisfied.forEach(x => console.error(chalk.yellow(`  ${x}`)));
}

console.log(chalk.blue('[uik]'), 'done installing design system');
