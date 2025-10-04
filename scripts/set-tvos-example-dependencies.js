// This should only be run from the project root by scripts/create-tvos-example.sh

// Modify FabricExample/package.json to use react-native-tvos

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Check if a react-native-tvos version exists.
 */
function tvVersionExists(version /*: string */) /*: boolean */ {
  try {
    const result = spawnSync(
      'npm',
      ['view', `react-native-tvos@${version}`, 'version'],
      {
        stdio: 'ignore',
      },
    );
    if (result.status !== 0) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Computes expected react-native-tvos version for a given core version.
 */
function tvVersionForCoreVersion(version /*: string */) /*: string */ {
  const match = version.match(/(.+)-rc\.(.+)/);
  if (!match) {
    // Stable release (e.g. 0.81.4, so TV version is 0.81.4-0)
    if (tvVersionExists(`${version}-0`)) {
      return `${version}-0`;
    }
    return 'latest';
  }
  // Release candidate (e.g. 0.82.0-rc.5, so TV version is 0.82.0-0rc5)
  const coreBaseVersion = match[1];
  const prerelease = match[2];
  // Release candidate (e.g. 0.82.0-rc.5, so TV version is 0.82.0-0rc5)
  if (tvVersionExists(`${coreBaseVersion}-0rc${prerelease}`)) {
    return `${coreBaseVersion}-0rc${prerelease}`;
  }
  return 'next';
}

const packageJsonPath = path.resolve(
  __dirname,
  '../FabricExample/package.json',
);

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const reactNativeCoreVersion = packageJson.dependencies['react-native'];
const reactNativeTVVersion = `npm:react-native-tvos@${tvVersionForCoreVersion(
  reactNativeCoreVersion,
)}`;
packageJson.dependencies['react-native'] = reactNativeTVVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
