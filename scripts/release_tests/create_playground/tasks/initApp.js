const fs = require('fs');
const path = require('path');
const logger = require('../logger');

// CLI < 20.2.0 always opens <Xcode>/Contents/Developer/Applications/Simulator.app,
// which Xcode 27 replaced with DeviceHub.app, so `run ios` fails on simulators.
// The fix was released only in the 20.x line; older majors are left untouched.
// remove this helper when we drop support for 0.86.
const CLI_PACKAGES = [
  '@react-native-community/cli',
  '@react-native-community/cli-platform-android',
  '@react-native-community/cli-platform-ios',
];
const FIXED_CLI_VERSION = '20.2.0';

function bumpCliForXcode27(appPath, logPath) {
  const packageJsonPath = path.join(appPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const devDependencies = packageJson.devDependencies ?? {};

  const bumped = CLI_PACKAGES.filter(name =>
    /^[~^]?20\.[01]\.\d+$/.test(devDependencies[name] ?? ''),
  );
  if (bumped.length === 0) {
    return;
  }

  for (const name of bumped) {
    logger.append(
      logPath,
      `Bumping ${name} from ${devDependencies[name]} to ${FIXED_CLI_VERSION}\n`,
    );
    devDependencies[name] = FIXED_CLI_VERSION;
  }
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log(
    `\n⚠️ Bumped React Native CLI to ${FIXED_CLI_VERSION} (Xcode 27 Simulator.app fix).`,
  );
}

function initApp(config, { runTask, runCommand }) {
  const { paths, appName } = config;
  const rnVersion = config['rn-version'];

  runTask('Ensuring playground directory exists', paths.log, () => {
    fs.mkdirSync(paths.playground, { recursive: true });
  });

  runTask('Cleaning old app directory', paths.log, () => {
    fs.rmSync(paths.app, { recursive: true, force: true });
    logger.append(paths.log, `Removed directory: ${paths.app}\n`);
  });

  runTask('Initializing React Native app', paths.log, () => {
    runCommand(
      'npx',
      [
        '@react-native-community/cli@latest',
        'init',
        appName,
        '--version',
        rnVersion,
        '--skip-install',
        '--skip-git-init',
      ],
      paths.playground,
      paths.log,
    );
  });

  runTask('Ensuring React Native CLI supports Xcode 27', paths.log, () => {
    bumpCliForXcode27(paths.app, paths.log);
  });
}

module.exports = initApp;
