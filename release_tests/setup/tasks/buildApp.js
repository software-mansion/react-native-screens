const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getXcodeVersion() {
  try {
    const out = execSync('xcodebuild -version', { encoding: 'utf8' });
    const match = out.match(/Xcode\s+(\d+)\.(\d+)/);
    if (!match) {
      return null;
    }
    return { major: Number(match[1]), minor: Number(match[2]) };
  } catch {
    return null;
  }
}

function parseRnSemver(rnVersion) {
  if (!rnVersion || typeof rnVersion !== 'string') {
    return null;
  }
  const match = rnVersion.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function isRnBelow083(rnVersion) {
  const rn = parseRnSemver(rnVersion);
  if (!rn) {
    return false;
  }
  if (rn.major !== 0) {
    return rn.major < 0;
  }
  return rn.minor < 83;
}

function needsFmtCpp17Workaround(rnVersion) {
  const xcode = getXcodeVersion();
  if (!xcode) {
    return false;
  }
  const isXcodeAffected =
    xcode.major > 26 || (xcode.major === 26 && xcode.minor >= 4);
  return isXcodeAffected && isRnBelow083(rnVersion);
}

function patchPodfileFmtCpp17(iosDir) {
  const podfilePath = path.join(iosDir, 'Podfile');
  let contents = fs.readFileSync(podfilePath, 'utf8');

  if (contents.includes("target.name == 'fmt'")) {
    return;
  }

  const snippet = `
    # Workaround: Xcode 26.4+ Apple Clang breaks fmt 11.0.2 consteval
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        end
      end
    end
`;

  if (!contents.includes('react_native_post_install(')) {
    throw new Error('Could not find react_native_post_install in Podfile');
  }

  contents = contents.replace(
    /(react_native_post_install\([\s\S]*?\n\s*\))/,
    `$1\n${snippet}`,
  );

  fs.writeFileSync(podfilePath, contents);
}

function installIosPods(config, { runTask, runCommand }) {
  const { paths } = config;

  runTask('Installing iOS Pods', paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');
    const gammaEnv = config.gamma ? 'RNS_GAMMA_ENABLED=1' : '';

    if (needsFmtCpp17Workaround(config['rn-version'])) {
      console.log(
        '\n⚠️ Xcode 26.4+ with RN < 0.83 detected. Patching Podfile to compile fmt as C++17...',
      );
      patchPodfileFmtCpp17(iosDir);
    }

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
  let cmd = `yarn android --no-packager --mode ${config.variant}`;
  if (config['android-device']) {
    cmd += ` --device "${config['android-device']}"`;
  }
  return cmd;
}

function buildIosRunCmd(config) {
  let cmd = `yarn ios --no-packager --mode ${config.capitalizedVariant}`;
  if (config['ios-udid']) {
    cmd += ` --udid "${config['ios-udid']}"`;
  } else if (config['ios-device']) {
    cmd += ` --device "${config['ios-device']}"`;
  } else if (config['ios-simulator']) {
    cmd += ` --simulator "${config['ios-simulator']}"`;
  }
  return cmd;
}

function isFmtConstevalError(error) {
  const errorMessage =
    (error.stdout?.toString() || '') + (error.stderr?.toString() || '');
  return (
    errorMessage.includes('call to consteval function') &&
    errorMessage.includes('fmt::basic_format_string')
  );
}

function runIosBuildWithFmtRetry(config, runCommand, { cmd, cwd }) {
  const { paths } = config;
  const iosDir = path.join(paths.app, 'ios');
  const gammaEnv = config.gamma ? 'RNS_GAMMA_ENABLED=1' : '';

  try {
    runCommand(cmd, cwd, paths.log, true);
  } catch (error) {
    if (!isFmtConstevalError(error)) {
      throw error;
    }

    console.log(
      '\n⚠️ Detected fmt consteval error (Xcode 26.4+). Patching Podfile to compile fmt as C++17 and retrying...',
    );

    patchPodfileFmtCpp17(iosDir);

    runCommand(
      `${gammaEnv} bundle install && ${gammaEnv} bundle exec pod install`,
      iosDir,
      paths.log,
      true,
    );

    runCommand(cmd, cwd, paths.log, true);
  }
}

function buildOnly(config, utils) {
  const { runTask, runCommand } = utils;
  const { paths, appName, capitalizedVariant, platform } = config;
  const buildIos = platform === 'ios' || platform === 'both';
  const buildAndroid = platform === 'android' || platform === 'both';

  if (buildAndroid) {
    runTask(`Building Android APK (${capitalizedVariant})`, paths.log, () => {
      runCommand(
        `./gradlew assemble${capitalizedVariant}`,
        path.join(paths.app, 'android'),
        paths.log,
      );
    });
  }

  if (buildIos) {
    installIosPods(config, utils);

    runTask(`Building iOS App (${capitalizedVariant})`, paths.log, () => {
      const iosDir = path.join(paths.app, 'ios');
      const xcodebuildCmd = `xcodebuild -workspace ${appName}.xcworkspace -scheme ${appName} -configuration ${capitalizedVariant} -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO`;

      runIosBuildWithFmtRetry(config, runCommand, {
        cmd: xcodebuildCmd,
        cwd: iosDir,
      });
    });
  }
}

function buildAndRun(config, utils) {
  const { runTask, runCommand, freePort, startMetro } = utils;
  const { paths, capitalizedVariant, platform } = config;
  const runIos = platform === 'ios' || platform === 'both';
  const runAndroid = platform === 'android' || platform === 'both';

  if (config.variant === 'debug') {
    runTask('Preparing Metro (free port 8081 + start)', paths.log, () => {
      freePort(8081);
      startMetro(paths.app, paths.log);
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
      runIosBuildWithFmtRetry(config, runCommand, {
        cmd: buildIosRunCmd(config),
        cwd: paths.app,
      });
    });
  }
}

function setupNativeDeps(config, utils) {
  const { platform } = config;
  const setupIos = platform === 'ios' || platform === 'both';

  if (setupIos) {
    installIosPods(config, utils);
  }
}

function buildApp(config, utils) {
  if (config.run) {
    buildAndRun(config, utils);
  } else if (config.build) {
    buildOnly(config, utils);
  } else {
    setupNativeDeps(config, utils);
  }
}

module.exports = buildApp;
