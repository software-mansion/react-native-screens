const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const logger = require('../logger');

function installPackedPackage(packFileName, config, { runTask, runCommand }) {
  runTask('Installing packed package in app', config.paths.log, () => {
    fs.writeFileSync(path.join(config.paths.app, 'yarn.lock'), '');
    runCommand(
      `yarn add ./${packFileName}`,
      config.paths.app,
      config.paths.log,
    );
  });
}

function setupLocalScreens(config, utils) {
  const { runTask, runCommand } = utils;
  const packFileName = 'screens-local.tgz';
  const packFile = path.join(config.paths.app, packFileName);

  runTask(
    'Installing screens library dependencies from local directory',
    config.paths.log,
    () => {
      runCommand('yarn install', config.paths.screens, config.paths.log);
    },
  );

  runTask('Building screens library', config.paths.log, () => {
    runCommand('yarn prepare', config.paths.screens, config.paths.log);
  });

  runTask('Packing local screens library', config.paths.log, () => {
    const output = runCommand(
      'npm pack',
      config.paths.screens,
      config.paths.log,
      true,
    );
    const rawPackFile = output.trim().split('\n').pop();

    fs.renameSync(path.join(config.paths.screens, rawPackFile), packFile);
    logger.append(config.paths.log, `Moved packed file to: ${packFile}\n`);
  });

  installPackedPackage(packFileName, config, utils);
}

function setupGitScreens(config, utils) {
  const { runTask, runCommand } = utils;
  const tempCloneDir = fs.mkdtempSync(path.join(os.tmpdir(), 'screens-clone-'));
  const targetVersion = config['screens-version'];
  const packFileName = `screens-${config['screens-version']}.tgz`;
  const packFile = path.join(config.paths.app, packFileName);

  runTask(
    `Preparing target version (${targetVersion}) in temporary directory`,
    config.paths.log,
    () => {
      let needsFetch = config['force-fetch'];

      const remoteUrl = execSync('git config --get remote.origin.url', {
        cwd: config.paths.screens,
      })
        .toString()
        .trim();

      runCommand(
        `git clone "${config.paths.screens}" "${tempCloneDir}"`,
        config.paths.releaseTests,
        config.paths.log,
      );

      if (config['force-fetch']) {
        console.log(
          `\n☁️ Force-fetching version '${targetVersion}' from the network (${remoteUrl})...`,
        );
      } else {
        console.log(
          `\n🔍 Checking if version '${targetVersion}' exists in the local repository...`,
        );
        try {
          execSync(`git rev-parse --verify ${targetVersion}`, {
            cwd: tempCloneDir,
            stdio: 'ignore',
          });
          console.log(
            `\n📂 Using version '${targetVersion}' from the local repository.`,
          );
        } catch (localError) {
          needsFetch = true;
          console.log(
            `\n☁️ Version '${targetVersion}' not found locally. Fetching from the network (${remoteUrl})...`,
          );
        }
      }

      if (needsFetch) {
        try {
          execSync(`git fetch ${remoteUrl} ${targetVersion}:${targetVersion}`, {
            cwd: tempCloneDir,
            stdio: 'ignore',
          });
        } catch (remoteError) {
          if (config['force-fetch']) {
            console.error(
              `\n❌ FATAL ERROR: Version '${targetVersion}' was not found on the network.`,
            );
          } else {
            console.error(
              `\n❌ FATAL ERROR: Version '${targetVersion}' was not found locally or on the network.`,
            );
          }
          fs.rmSync(tempCloneDir, { recursive: true, force: true });
          process.exit(1);
        }
      }
      try {
        runCommand(
          `git checkout ${targetVersion}`,
          tempCloneDir,
          config.paths.log,
        );

        console.log(`\n📦 Building package in an isolated environment...\n`);
        runCommand('yarn install', tempCloneDir, config.paths.log);
        runCommand('yarn prepare', tempCloneDir, config.paths.log);

        const output = runCommand(
          'npm pack',
          tempCloneDir,
          config.paths.log,
          true,
        );
        const rawPackFile = output.trim().split('\n').pop();

        fs.copyFileSync(path.join(tempCloneDir, rawPackFile), packFile);
        logger.append(
          config.paths.log,
          `Copied packed file from tmp to: ${packFile}\n`,
        );
      } finally {
        fs.rmSync(tempCloneDir, { recursive: true, force: true });
      }
    },
  );

  installPackedPackage(packFileName, config, utils);
}

function setupScreens(config, utils) {
  if (config['screens-version'] === 'local') {
    setupLocalScreens(config, utils);
  } else {
    setupGitScreens(config, utils);
  }
}

module.exports = setupScreens;
