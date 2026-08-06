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

function refExistsLocally(screensPath, target) {
  try {
    execSync(`git rev-parse --verify "${target}^{commit}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function isBranchOrTag(screensPath, target) {
  try {
    execSync(`git show-ref --verify --quiet "refs/heads/${target}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    // not a local branch
  }
  try {
    execSync(`git show-ref --verify --quiet "refs/tags/${target}"`, {
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

function cloneBranchOrTag(source, target, tempCloneDir, config, runCommand) {
  runCommand(
    `git clone --single-branch --branch "${target}" "${source}" "${tempCloneDir}"`,
    config.paths.releaseTests,
    config.paths.log,
  );
}

function cloneCommitLocal(
  screensPath,
  target,
  tempCloneDir,
  config,
  runCommand,
) {
  runCommand(
    `git clone --no-checkout "${screensPath}" "${tempCloneDir}"`,
    config.paths.releaseTests,
    config.paths.log,
  );
  runCommand(`git checkout "${target}"`, tempCloneDir, config.paths.log);
}

function failRemoteClone(target, config, tempCloneDir, refType) {
  if (config['force-fetch']) {
    console.error(
      `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found on the network.`,
    );
  } else {
    console.error(
      `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found locally or on the network.`,
    );
  }
  if (refType === 'unknown' && looksLikeCommitHash(target)) {
    console.error(
      `Hint: '${target}' looks like a commit hash. Use -s commit:${target} to fetch it from the remote (add -f to force-fetch from origin).`,
    );
  }
  fs.rmSync(tempCloneDir, { recursive: true, force: true });
  process.exit(1);
}

function cloneCommitRemote(remoteUrl, target, tempCloneDir, config, runCommand) {
  try {
    runCommand(
      `git clone --no-checkout "${remoteUrl}" "${tempCloneDir}"`,
      config.paths.releaseTests,
      config.paths.log,
    );
    runCommand(`git fetch origin "${target}"`, tempCloneDir, config.paths.log);
    runCommand(`git checkout "${target}"`, tempCloneDir, config.paths.log);
  } catch {
    failRemoteClone(target, config, tempCloneDir, 'commit');
  }
}

function cloneFromRemoteAsBranch(
  remoteUrl,
  target,
  tempCloneDir,
  config,
  runCommand,
  refType,
) {
  try {
    cloneBranchOrTag(remoteUrl, target, tempCloneDir, config, runCommand);
  } catch {
    failRemoteClone(target, config, tempCloneDir, refType);
  }
}

function cloneUnknownLocal(
  screensPath,
  target,
  tempCloneDir,
  config,
  runCommand,
) {
  if (isBranchOrTag(screensPath, target)) {
    cloneBranchOrTag(screensPath, target, tempCloneDir, config, runCommand);
  } else {
    cloneCommitLocal(screensPath, target, tempCloneDir, config, runCommand);
  }
}

function prepareClone(
  refType,
  target,
  screensPath,
  remoteUrl,
  useLocal,
  tempCloneDir,
  config,
  runCommand,
) {
  if (useLocal) {
    if (refType === 'branch' || refType === 'tag') {
      cloneBranchOrTag(screensPath, target, tempCloneDir, config, runCommand);
    } else if (refType === 'commit') {
      cloneCommitLocal(screensPath, target, tempCloneDir, config, runCommand);
    } else {
      // unknown — heuristic behavior
      cloneUnknownLocal(screensPath, target, tempCloneDir, config, runCommand);
    }
    return;
  }

  if (refType === 'commit') {
    cloneCommitRemote(remoteUrl, target, tempCloneDir, config, runCommand);
    return;
  }

  // branch / tag / unknown — clone --branch (bare commit hashes need commit:<sha>)
  cloneFromRemoteAsBranch(
    remoteUrl,
    target,
    tempCloneDir,
    config,
    runCommand,
    refType,
  );
}

function setupCurrentScreens(config, utils) {
  const { runTask, runCommand } = utils;
  const packFileName = 'screens-current.tgz';
  const packFile = path.join(config.paths.app, packFileName);

  runTask(
    'Installing screens library dependencies from current working tree',
    config.paths.log,
    () => {
      runCommand('yarn install', config.paths.screens, config.paths.log);
    },
  );

  runTask('Building screens library', config.paths.log, () => {
    runCommand('yarn prepare', config.paths.screens, config.paths.log);
  });

  runTask('Packing screens library from current working tree', config.paths.log, () => {
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
  const refType = config['screens-ref-type'];
  const target = config['screens-ref-target'];
  const packFileName = `screens-${target.replace(/\//g, '-')}.tgz`;
  const packFile = path.join(config.paths.app, packFileName);
  const screensPath = config.paths.screens;

  runTask(
    `Preparing target version (${refType}:${target}) in temporary directory`,
    config.paths.log,
    () => {
      const remoteUrl = execSync('git config --get remote.origin.url', {
        cwd: screensPath,
      })
        .toString()
        .trim();

      const existsLocally = refExistsLocally(screensPath, target);
      const useLocal = !config['force-fetch'] && existsLocally;

      if (config['force-fetch']) {
        console.log(
          `\n☁️ Force-fetching version '${target}' (${refType}) from the network (${remoteUrl})...`,
        );
      } else {
        console.log(
          `\n🔍 Checking if version '${target}' (${refType}) exists in the local repository...`,
        );
        if (useLocal) {
          console.log(
            `\n📂 Using version '${target}' (${refType}) from the local repository.`,
          );
        } else {
          console.log(
            `\n☁️ Version '${target}' (${refType}) not found locally. Fetching from the network (${remoteUrl})...`,
          );
        }
      }

      try {
        prepareClone(
          refType,
          target,
          screensPath,
          remoteUrl,
          useLocal,
          tempCloneDir,
          config,
          runCommand,
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
  if (config['screens-ref-type'] === 'current') {
    setupCurrentScreens(config, utils);
  } else {
    setupGitScreens(config, utils);
  }
}

module.exports = setupScreens;
