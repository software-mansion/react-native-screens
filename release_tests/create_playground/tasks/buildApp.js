const fs = require('fs');
const path = require('path');

// remove this helper when we drop support for 0.84.
function gemfileHasGem(gemfile, gemName) {
  return new RegExp(`^\\s*gem\\s+['"]${gemName}['"]`, 'm').test(gemfile);
}

// remove this helper when we drop support for 0.84.
function canRequireKconv(appPath, { runCommand, logPath }) {
  try {
    runCommand(
      'bundle exec ruby -e "require \'kconv\'"',
      appPath,
      logPath,
      true,
    );
    return true;
  } catch {
    return false;
  }
}

// remove this helper when we drop support for 0.84.
function ensureNkfGem(appPath, { runCommand, logPath }) {
  const gemfilePath = path.join(appPath, 'Gemfile');
  const gemfile = fs.readFileSync(gemfilePath, 'utf8');

  if (gemfileHasGem(gemfile, 'nkf')) {
    // if the gemfile has the gem name, return
    return;
  }

  if (canRequireKconv(appPath, { runCommand, logPath })) {
    // if the gem can require kconv, return
    return;
  }

  console.log(
    `\n⚠️ Gemfile is missing 'nkf' (required to load kconv). Adding it...`,
  );
  runCommand('bundle add nkf', appPath, logPath);
  // `bundle add nkf` deafult make bundle install, so we don't need to run it again
}

function installIosPods(config, { runTask, runCommand }) {
  const { paths } = config;

  runTask('Installing iOS Pods', paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');

    runCommand(`bundle install`, paths.app, paths.log);

    // Workaround for RN < 0.85 templates: Gemfile may lack `nkf`, which is
    // needed to `require 'kconv'` on Ruby 3.4+. RN 0.85 added `nkf` to the
    // template — remove this helper when we drop support for 0.84.
    // https://react-native-community.github.io/upgrade-helper/?from=0.84.1&to=0.85.0
    ensureNkfGem(paths.app, {
      runCommand,
      logPath: paths.log,
    });

    runCommand(`bundle exec pod install`, iosDir, paths.log);
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
