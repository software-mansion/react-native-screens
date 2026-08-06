const fs = require('fs');
const logger = require('../logger');

function initApp(config, { runTask, runCommand }) {
  const { paths, appName } = config;

  runTask('Cleaning old app folder', paths.log, () => {
    fs.rmSync(paths.app, { recursive: true, force: true });
    logger.append(paths.log, `Removed directory: ${paths.app}\n`);
  });

  runTask('Initializing React Native app', paths.log, () => {
    runCommand(
      `npx @react-native-community/cli@latest init ${appName} --version ${config['rn-version']} --skip-install`,
      paths.releaseTests,
      paths.log,
    );
  });
}

module.exports = initApp;
