const { cat, exec } = require('shelljs');

/**
 * @param {string} packageJsonPath
 * @returns {{ currentVersion: string; newVersion: string }}
 */
function getVersion(packageJsonPath) {
  const packageJson = JSON.parse(cat(packageJsonPath));
  const currentVersion = packageJson.version;
  const dateIdentifier = new Date()
    .toISOString()
    .slice(0, -5)
    .replace(/[-:T]/g, '')
    .slice(0, -6);

  if (currentVersion.includes('nightly')) {
    throw new Error('Cannot set nightly version on a nightly version');
  }

  const currentCommit = exec('git rev-parse HEAD', {
    silent: true,
  }).stdout.trim();
  const shortCommit = currentCommit.slice(0, 9);

  const newVersion = `${
    currentVersion.split('-')[0]
  }-nightly-${dateIdentifier}-${shortCommit}`;

  return {
    currentVersion,
    newVersion,
  };
}

module.exports = {
  getVersion,
};
