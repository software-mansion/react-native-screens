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

function buildApp(config, { runTask, runCommand }) {
  const { paths, appName, capitalizedVariant } = config;

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

  runTask(`Building Android APK (${capitalizedVariant})`, paths.log, () => {
    runCommand(
      `./gradlew assemble${capitalizedVariant}`,
      path.join(paths.app, 'android'),
      paths.log,
    );
  });

  runTask(`Building iOS App (${capitalizedVariant})`, paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');
    const gammaEnv = config.gamma ? 'RNS_GAMMA_ENABLED=1' : '';
    const xcodebuildCmd = `xcodebuild -workspace ${appName}.xcworkspace -scheme ${appName} -configuration ${capitalizedVariant} -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO`;

    try {
      runCommand(xcodebuildCmd, iosDir, paths.log, true);
    } catch (error) {
      const errorMessage =
        (error.stdout?.toString() || '') + (error.stderr?.toString() || '');

      if (
        errorMessage.includes('call to consteval function') &&
        errorMessage.includes('fmt::basic_format_string')
      ) {
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

        runCommand(xcodebuildCmd, iosDir, paths.log, true);
      } else {
        throw error;
      }
    }
  });
}

module.exports = buildApp;
