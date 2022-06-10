const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const replaceInFiles = require('replace-in-files');
const semver = require('semver');

const { logger } = require('../utils');

const [cliVersion] = process.argv.slice(2);

const workingDir = path.resolve(__dirname, '../../../');

logger.log('\n-----------------------------------------------------\n');

(async() => {
  let version = null;

  if (!cliVersion) {
    const { continueApiGen } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueApiGen',
        message: 'This script will generate a new API and Guides. \nContinue?',
        default: true,
      }
    ]);

    if (!continueApiGen) {
      process.exit(0);
    }

    ({ version } = await inquirer.prompt([
      {
        name: 'version',
        type: 'input',
        message: 'What version do you want to generate (required format "Major.Minor" e.g. 9.1)',
        validate: s => (/^\d+.\d+$/.test(s) ? true : 'The provided version is not correct'),
      },
    ]));

  } else if (semver.valid(cliVersion)) {
    version = `${semver.major(cliVersion)}.${semver.minor(cliVersion)}`;

  } else if (semver.valid(`${cliVersion}.0`)) {
    version = cliVersion;

  } else {
    logger.error(
      `This provided version number (${cliVersion}) is neither semver-compatible nor in a format of '[major].[minor]'.`
    );
    process.exit(1);
  }

  if (fs.existsSync(path.join(workingDir, version))) {
    logger.error(`This version of the documentation (${version}) is already generated.`);
    process.exit(1);
  }

  // * copy `/next/` to `/${version}/`
  fse.copySync(path.join(workingDir, 'next'), path.join(workingDir, version));

  // * replace all `/next/` into `/${version}/` for the new version
  await replaceInFiles({
    files: path.join(workingDir, version, '**/*.md'),
    from: /permalink: \/next\//g,
    to: `permalink: /${version}/`,
  });
  // replace all BigExample and BigExampleSource links to the new version
  // we must add .0 at the end, because the folder in the examples has schema [major].[minor].[patch]
  //
  // For example, if "version" is 11.1, we change from:
  // /examples/next/docs/
  // To:
  // /examples/11.1.0/docs/
  await replaceInFiles({
    files: path.join(workingDir, version, '**/*.md'),
    from: /\/examples\/next\/docs\//g,
    to: `/examples/${version}.0/docs/`,
  });
  // replace all versioning assets to the new version
  await replaceInFiles({
    files: path.join(workingDir, version, '**/*.md'),
    from: /\/docs\/next\//g,
    to: `/docs/${version}/`,
  });
  logger.success(`Permalinks for current latest (${version}) updated.\n`);

  // * print kind information, that version was been created.
  logger.success(`Version: ${version} successfully created.\n`);
})();
