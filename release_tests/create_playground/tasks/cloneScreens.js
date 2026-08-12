const { execSync } = require('child_process');

function getRemoteUrl(screensPath) {
  try {
    return execSync('git config --get remote.origin.url', {
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
    execSync(`git rev-parse --verify "${target}^{commit}"`, {
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
    execSync(`git show-ref --verify --quiet "refs/heads/${target}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    // not a local branch
    return false;
  }
}

function isLocalTag(screensPath, target) {
  try {
    execSync(`git show-ref --verify --quiet "refs/tags/${target}"`, {
      cwd: screensPath,
      stdio: 'ignore',
    });
    return true;
  } catch {
    // not a local tag
    return false;
  }
}

function matchesCommitShaFormat(ref) {
  return /^[0-9a-f]{7,40}$/i.test(ref);
}

function failRemoteClone({ target, forceFetch, refType }) {
  if (forceFetch) {
    console.error(
      `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found on the network.`,
    );
  } else {
    console.error(
      `\n❌ FATAL ERROR: Version '${refType}:${target}' was not found locally or on the network.`,
    );
  }
  if (refType === 'unknown' && matchesCommitShaFormat(target)) {
    console.error(
      `Hint: '${target}' looks like a commit hash. Use -s commit:${target} to fetch it from the remote (add -f to force-fetch from origin).`,
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
  forceFetch,
}) {
  const git = (cmd, cwd = releaseTestsPath) => runCommand(cmd, cwd, logPath);

  function cloneBranchOrTag(source) {
    git(
      `git clone --single-branch --branch "${target}" "${source}" "${tempCloneDir}"`,
    );
  }

  function checkoutCommit(source, { fetch = false } = {}) {
    git(`git clone --no-checkout "${source}" "${tempCloneDir}"`);
    try {
      git(`git checkout "${target}"`, tempCloneDir);
    } catch (error) {
      if (fetch) {
        git(`git fetch origin "${target}"`, tempCloneDir);
        git(`git checkout "${target}"`, tempCloneDir);
      } else {
        throw error;
      }
    }
  }

  if (useLocal) {
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
    failRemoteClone({ target, forceFetch, refType });
  }
}

module.exports = {
  getRemoteUrl,
  refExistsLocally,
  cloneScreensRef,
};
