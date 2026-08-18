const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const {
  getRemoteUrl,
  refExistsLocally,
  cloneScreensRef,
} = require('./cloneScreens');

function installPackedPackage(packFileName, config, { runTask, runCommand }) {
  runTask('Installing packed package in app', config.paths.log, () => {
    // Without a local one it would pick up the repo root's yarn.lock and treat
    // the app as part of the screens project. An empty yarn.lock marks the app
    // directory as its own project root, so `yarn add` installs here.
    fs.writeFileSync(path.join(config.paths.app, 'yarn.lock'), '');
    runCommand(
      'yarn',
      ['add', `./${packFileName}`],
      config.paths.app,
      config.paths.log,
    );
  });
}

function buildAndPackScreens(sourceDir, packFile, config, { runCommand }) {
  runCommand('yarn', ['install'], sourceDir, config.paths.log);
  runCommand('yarn', ['prepare'], sourceDir, config.paths.log);

  const output = runCommand(
    'npm',
    ['pack', '--json', '--ignore-scripts'],
    sourceDir,
    config.paths.log,
    true,
  );
  const [{ filename: rawPackFile }] = JSON.parse(output);
  const packedPath = path.join(sourceDir, rawPackFile);

  fs.renameSync(packedPath, packFile);
  logger.append(
    config.paths.log,
    `Moved packed file from ${packedPath} to ${packFile}\n`,
  );
}

function setupScreensFromWorkingTree(config, utils) {
  const { runTask } = utils;
  const packFileName = 'screens-current.tgz';
  const packFile = path.join(config.paths.app, packFileName);

  runTask(
    'Building and packing screens from current working tree',
    config.paths.log,
    () => {
      console.log(`\n📦 Building package from current working tree...\n`);
      buildAndPackScreens(config.paths.screens, packFile, config, utils);
    },
  );

  installPackedPackage(packFileName, config, utils);
}

function setupScreensFromRef(config, utils) {
  const { runTask, runCommand, withTempDir } = utils;
  const refType = config['screens-ref-type'];
  const target = config['screens-ref-target'];
  const packFileName = `screens-${target.replace(/[^a-z0-9._-]/gi, '-')}.tgz`;
  const packFile = path.join(config.paths.app, packFileName);
  const screensPath = config.paths.screens;
  const forceFetch = config['force-fetch'];

  runTask(
    `Preparing target version (${refType}:${target}) in temporary directory`,
    config.paths.log,
    () => {
      withTempDir('screens-clone-', tempCloneDir => {
        const useLocal = !forceFetch && refExistsLocally(screensPath, target);
        const remoteUrl = useLocal ? null : getRemoteUrl(screensPath);

        if (forceFetch) {
          console.log(
            `\n☁️ Force-fetching version '${target}' (${refType}) from the network (${remoteUrl})...`,
          );
        } else if (useLocal) {
          console.log(
            `\n📂 Using version '${target}' (${refType}) from the local repository.`,
          );
        } else {
          console.log(
            `\n☁️ Version '${target}' (${refType}) not found locally. Fetching from the network (${remoteUrl})...`,
          );
        }

        cloneScreensRef({
          refType,
          target,
          screensPath,
          remoteUrl,
          useLocal,
          tempCloneDir,
          releaseTestsPath: config.paths.releaseTests,
          logPath: config.paths.log,
          runCommand,
          forceFetch,
        });

        console.log(`\n📦 Building package in an isolated environment...\n`);
        buildAndPackScreens(tempCloneDir, packFile, config, utils);
      });
    },
  );

  installPackedPackage(packFileName, config, utils);
}

function setupScreens(config, utils) {
  if (config['screens-ref-type'] === 'current') {
    setupScreensFromWorkingTree(config, utils);
  } else {
    setupScreensFromRef(config, utils);
  }
}

module.exports = setupScreens;
