const fs = require('fs');
const logger = require('../logger');

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
}

module.exports = initApp;
