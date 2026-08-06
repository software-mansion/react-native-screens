const path = require('path');

function buildApp(config, { runTask, runCommand }) {
  const { paths, appName, capitalizedVariant } = config;

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

  runTask(`Building Android APK (${capitalizedVariant})`, paths.log, () => {
    runCommand(
      `./gradlew assemble${capitalizedVariant}`,
      path.join(paths.app, 'android'),
      paths.log,
    );
  });

  runTask(`Building iOS App (${capitalizedVariant})`, paths.log, () => {
    runCommand(
      `xcodebuild -workspace ${appName}.xcworkspace -scheme ${appName} -configuration ${capitalizedVariant} -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO`,
      path.join(paths.app, 'ios'),
      paths.log,
    );
  });
}

module.exports = buildApp;
