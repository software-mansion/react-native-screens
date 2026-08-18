const { execFileSync } = require('child_process');

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

function failLocalClone({ target, refType }) {
  console.error(
    `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found locally.`,
  );
  console.error(`Hint: fetch it first, or pass -f to take it from origin.`);
  throw new Error(`Version '${refType}:${target}' was not found locally`);
}

function failRemoteClone({ target, refType }) {
  console.error(
    `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found on the network.`,
  );
  throw new Error(`Version '${refType}:${target}' was not found`);
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
      failLocalClone({ target, refType });
    }
    return;
  }

  try {
    cloneFromSource(remoteUrl);
  } catch {
    failRemoteClone({ target, refType });
  }
}

module.exports = {
  getRemoteUrl,
  cloneScreensRef,
};
