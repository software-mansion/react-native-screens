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

function refExistsLocally(screensPath, target) {
  try {
    execFileSync('git', ['rev-parse', '--verify', `${target}^{commit}`], {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function isLocalBranch(screensPath, target) {
  try {
    execFileSync(
      'git',
      ['show-ref', '--verify', '--quiet', `refs/heads/${target}`],
      {
        cwd: screensPath,
        stdio: 'ignore',
      },
    );
    return true;
  } catch {
    // not a local branch
    return false;
  }
}

function isLocalTag(screensPath, target) {
  try {
    execFileSync(
      'git',
      ['show-ref', '--verify', '--quiet', `refs/tags/${target}`],
      {
        cwd: screensPath,
        stdio: 'ignore',
      },
    );
    return true;
  } catch {
    // not a local tag
    return false;
  }
}

function matchesCommitShaFormat(ref) {
  return /^[0-9a-f]{7,40}$/i.test(ref);
}

function failLocalClone({ target, refType }) {
  console.error(
    `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found locally.`,
  );
  console.error(
    `Hint: fetch it first, or pass -f to take it from origin.`,
  );
  throw new Error(`Version '${refType}:${target}' was not found locally`);
}

function failRemoteClone({ target, refType }) {
  console.error(
    `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found on the network.`,
  );
  if (refType === 'unknown' && matchesCommitShaFormat(target)) {
    console.error(
      `Hint: '${target}' looks like a commit hash. Use -s commit:${target} -f.`,
    );
  }
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

  function cloneBranchOrTag(source) {
    git(['clone', '--single-branch', '--branch', target, source, tempCloneDir]);
  }

  function checkoutCommit(source, { fetch = false } = {}) {
    git(['clone', '--no-checkout', source, tempCloneDir]);
    try {
      git(['checkout', target], tempCloneDir);
    } catch (error) {
      if (fetch) {
        git(['fetch', 'origin', target], tempCloneDir);
        git(['checkout', target], tempCloneDir);
      } else {
        throw error;
      }
    }
  }

  if (useLocal) {
    if (!refExistsLocally(screensPath, target)) {
      failLocalClone({ target, refType });
    }
    if (refType === 'branch' || refType === 'tag') {
      cloneBranchOrTag(screensPath);
      return;
    }
    if (refType === 'commit') {
      checkoutCommit(screensPath);
      return;
    }
    if (isLocalBranch(screensPath, target) || isLocalTag(screensPath, target)) {
      cloneBranchOrTag(screensPath);
    } else {
      checkoutCommit(screensPath);
    }
    return;
  }

  try {
    if (refType === 'commit') {
      checkoutCommit(remoteUrl, { fetch: true });
    } else {
      // branch / tag / unknown — clone --branch (bare commit hashes need commit:<sha>)
      cloneBranchOrTag(remoteUrl);
    }
  } catch {
    failRemoteClone({ target, refType });
  }
}

module.exports = {
  getRemoteUrl,
  refExistsLocally,
  cloneScreensRef,
};
