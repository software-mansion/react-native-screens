const fs = require('fs');
const path = require('path');

function gemfileHasGem(gemfile, gemName) {
  return new RegExp(`^\\s*gem\\s+['"]${gemName}['"]`, 'm').test(gemfile);
}

function isRuby34OrNewer(appPath, { runCommand, logPath }) {
  const version = runCommand(
    'ruby -e "print RUBY_VERSION"',
    appPath,
    logPath,
    true,
  ).trim();
  const [major, minor] = version.split('.').map(Number);
  return major > 3 || (major === 3 && minor >= 4);
}

function ensureRuby34Gems(appPath, { runCommand, logPath }) {
  if (!isRuby34OrNewer(appPath, { runCommand, logPath })) {
    return;
  }

  const gemfilePath = path.join(appPath, 'Gemfile');
  const gemfile = fs.readFileSync(gemfilePath, 'utf8');

  if (!gemfileHasGem(gemfile, 'nkf')) {
    console.log(
      `\n⚠️ Gemfile is missing 'nkf' (needed on Ruby 3.4+). Adding it...`,
    );
    runCommand('bundle add nkf', appPath, logPath);
  }
}

function installIosPods(config, { runTask, runCommand }) {
  const { paths } = config;

  runTask('Installing iOS Pods', paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');
    const gammaEnv = config.gamma ? 'RNS_GAMMA_ENABLED=1' : '';

    ensureRuby34Gems(paths.app, {
      runCommand,
      logPath: paths.log,
    });

    runCommand(
      `${gammaEnv} bundle install && ${gammaEnv} bundle exec pod install`,
      iosDir,
      paths.log,
    );
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

  runTask('Freeing Metro port 8081', paths.log, () => {
    freePort(8081);
  });

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
