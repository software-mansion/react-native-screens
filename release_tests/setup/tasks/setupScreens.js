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

function refExistsLocally(screensPath, targetVersion) {
  try {
    execSync(`git rev-parse --verify "${targetVersion}^{commit}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function isBranchOrTag(screensPath, targetVersion) {
  try {
    execSync(`git show-ref --verify --quiet "refs/heads/${targetVersion}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    // not a local branch
  }
  try {
    execSync(`git show-ref --verify --quiet "refs/tags/${targetVersion}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function looksLikeCommitHash(ref) {
  return /^[0-9a-f]{7,40}$/i.test(ref);
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
  const packFileName = `screens-${targetVersion.replace(/\//g, '-')}.tgz`;
  const packFile = path.join(config.paths.app, packFileName);
  const screensPath = config.paths.screens;

  runTask(
    `Preparing target version (${targetVersion}) in temporary directory`,
    config.paths.log,
    () => {
      const remoteUrl = execSync('git config --get remote.origin.url', {
        cwd: screensPath,
      })
        .toString()
        .trim();

      const existsLocally = refExistsLocally(screensPath, targetVersion);
      const useLocal = !config['force-fetch'] && existsLocally;

      if (config['force-fetch']) {
        console.log(
          `\n☁️ Force-fetching version '${targetVersion}' from the network (${remoteUrl})...`,
        );
      } else {
        console.log(
          `\n🔍 Checking if version '${targetVersion}' exists in the local repository...`,
        );
        if (useLocal) {
          console.log(
            `\n📂 Using version '${targetVersion}' from the local repository.`,
          );
        } else {
          console.log(
            `\n☁️ Version '${targetVersion}' not found locally. Fetching from the network (${remoteUrl})...`,
          );
        }
      }

      try {
        if (useLocal) {
          if (isBranchOrTag(screensPath, targetVersion)) {
            runCommand(
              `git clone --single-branch --branch "${targetVersion}" "${screensPath}" "${tempCloneDir}"`,
              config.paths.releaseTests,
              config.paths.log,
            );
          } else {
            runCommand(
              `git clone --no-checkout "${screensPath}" "${tempCloneDir}"`,
              config.paths.releaseTests,
              config.paths.log,
            );
            runCommand(
              `git checkout "${targetVersion}"`,
              tempCloneDir,
              config.paths.log,
            );
          }
        } else {
          try {
            runCommand(
              `git clone --single-branch --branch "${targetVersion}" "${remoteUrl}" "${tempCloneDir}"`,
              config.paths.releaseTests,
              config.paths.log,
            );
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
            if (looksLikeCommitHash(targetVersion)) {
              console.error(
                `Hint: '${targetVersion}' looks like a commit hash. git clone --branch cannot fetch a bare commit from the network; use a branch/tag, or ensure the commit exists locally (without -f).`,
              );
            }
            fs.rmSync(tempCloneDir, { recursive: true, force: true });
            process.exit(1);
          }
        }

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
