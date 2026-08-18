const { execFileSync } = require('child_process');
const { fatal } = require('../utils');

function getRemoteUrl(screensPath) {
  try {
    return execFileSync('git', ['config', '--get', 'remote.origin.url'], {
      cwd: screensPath,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    throw new Error("Cannot find git remote 'origin'.");
  }
}

function cloneScreensRef({
  refType,
  target,
  screensPath,
  remoteUrl,
  useLocal,
  tempCloneDir,
  releaseTestsPath,
  logPath,
  runCommand,
}) {
  const git = (args, cwd = releaseTestsPath) =>
    runCommand('git', args, cwd, logPath);

  function cloneFromSource(source) {
    git(['init', tempCloneDir]);
    git(['remote', 'add', 'origin', source], tempCloneDir);

    if (refType === 'commit') {
      git(['fetch', 'origin', target], tempCloneDir);
      git(['checkout', 'FETCH_HEAD'], tempCloneDir);
      return;
    }

    const ref =
      refType === 'tag' ? `refs/tags/${target}` : `refs/heads/${target}`;
    git(['fetch', 'origin', `${ref}:${ref}`], tempCloneDir);
    git(['checkout', target], tempCloneDir);
  }

  if (useLocal) {
    try {
      cloneFromSource(screensPath);
    } catch {
      fatal(
        `Version '${refType}:${target}' was not found locally.\n` +
          `Hint: fetch it first, or pass -f to take it from origin.`,
      );
    }
    return;
  }

  try {
    cloneFromSource(remoteUrl);
  } catch {
    fatal(`Version '${refType}:${target}' was not found on the network.`);
  }
}

module.exports = {
  getRemoteUrl,
  cloneScreensRef,
};
