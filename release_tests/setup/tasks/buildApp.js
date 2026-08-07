const path = require('path');

function installIosPods(config, { runTask, runCommand }) {
  const { paths } = config;

  runTask('Installing iOS Pods', paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');
    const gammaEnv = config.gamma ? 'RNS_GAMMA_ENABLED=1' : '';

    try {
      runCommand(
        `${gammaEnv} bundle install && ${gammaEnv} bundle exec pod install`,
        iosDir,
        paths.log,
        true,
      );
    } catch (error) {
      const errorMessage =
        (error.stdout?.toString() || '') + (error.stderr?.toString() || '');

      if (errorMessage.includes('cannot load such file -- kconv')) {
        console.log(
          '\n⚠️ Detected missing kconv (Ruby 3.4+). Adding nkf gem and retrying...',
        );

        runCommand('bundle add nkf', paths.app, paths.log);

        runCommand(
          `${gammaEnv} bundle install && ${gammaEnv} bundle exec pod install`,
          iosDir,
          paths.log,
          true,
        );
      } else {
        throw error;
      }
    }
  });
}

function buildAndroidRunCmd(config) {
  let cmd = `yarn run android --mode ${config.variant}`;
  if (config['android-device']) {
    cmd += ` --device "${config['android-device']}"`;
  }
  return cmd;
}

function buildIosRunCmd(config) {
  let cmd = `yarn run ios --mode ${config.capitalizedVariant}`;
  if (config['ios-udid']) {
    cmd += ` --udid "${config['ios-udid']}"`;
  } else if (config['ios-device']) {
    cmd += ` --device "${config['ios-device']}"`;
  } else if (config['ios-simulator']) {
    cmd += ` --simulator "${config['ios-simulator']}"`;
  }
  return cmd;
}

function buildAndRun(config, utils) {
  const { runTask, runCommand, freePort } = utils;
  const { paths, capitalizedVariant, platform } = config;
  const runIos = platform === 'ios' || platform === 'both';
  const runAndroid = platform === 'android' || platform === 'both';

  if (config.variant === 'debug') {
    runTask('Freeing Metro port 8081', paths.log, () => {
      freePort(8081);
    });
  }

  if (runAndroid) {
    runTask(
      `Building & running Android (${capitalizedVariant})`,
      paths.log,
      () => {
        runCommand(buildAndroidRunCmd(config), paths.app, paths.log);
      },
    );
  }

  if (runIos) {
    installIosPods(config, utils);

    runTask(`Building & running iOS (${capitalizedVariant})`, paths.log, () => {
      runCommand(buildIosRunCmd(config), paths.app, paths.log);
    });
  }
}

module.exports = buildAndRun;
