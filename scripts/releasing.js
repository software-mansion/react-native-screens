const { cat, exec } = require('shelljs');

/**
 * @param {string[]} args
 * @param {string} packageJsonPath
 * @returns {{ currentVersion: string; newVersion: string }}
 */
function getVersion(args, packageJsonPath) {
  let IS_NIGHTLY = false;
  let IS_SET_CUSTOM = false;

  let customVersion = '';

  args.slice(2).forEach(arg => {
    if (arg === '--nightly' || arg === '-n') {
      IS_NIGHTLY = true;
    } else {
      customVersion = arg;
      IS_SET_CUSTOM = true;
    }
  });

  if (IS_NIGHTLY && IS_SET_CUSTOM) {
    throw new Error('Cannot set nightly or fresh version with custom version.');
  }

  if (!IS_SET_CUSTOM && !IS_NIGHTLY) {
    throw new Error('Version not set.');
  }

  const packageJson = JSON.parse(cat(packageJsonPath));
  const currentVersion = packageJson.version;

  let newVersion = currentVersion;
  if (IS_SET_CUSTOM) {
    newVersion = customVersion;
  } else {
    if (currentVersion.includes('nightly')) {
      throw new Error('Cannot set nightly version on a nightly version');
    }

    if (IS_NIGHTLY) {
      // increment minor version for nightly build
      const [major, minor,] = newVersion.split('.');
      newVersion = `${major}.${parseInt(minor)+1}.0`;
    }

    const dateIdentifier = new Date()
      .toISOString()
      .slice(0, -5)
      .replace(/[-:T]/g, '')
      .slice(0, -6);

    const currentCommit = exec('git rev-parse HEAD', {
      silent: true,
    }).stdout.trim();
    const shortCommit = currentCommit.slice(0, 9);

    newVersion = `${
      newVersion.split('-')[0]
    }-nightly-${dateIdentifier}-${shortCommit}`;
  }

  return {
    currentVersion,
    newVersion,
  };
}

module.exports = {
  getVersion,
};
