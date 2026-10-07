const fs = require('fs');
const path = require('path');

// remove this helper when we drop support for 0.84.
function gemfileHasGem(gemfile, gemName) {
  return new RegExp(`^\\s*gem\\s+['"]${gemName}['"]`, 'm').test(gemfile);
}

// remove this helper when we drop support for 0.84.
function isKconvAvailable(appPath, { runCommand, logPath }) {
  console.log(
    `\nℹ️ Checking whether 'kconv' can be required (this command may fail)...`,
  );
  try {
    runCommand(
      'bundle',
      ['exec', 'ruby', '-e', "require 'kconv'"],
      appPath,
      logPath,
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
    return;
  }

  if (isKconvAvailable(appPath, { runCommand, logPath })) {
    return;
  }

  console.log(
    `\n⚠️ Gemfile is missing 'nkf' (required to load kconv). Adding it...`,
  );
  // `bundle add nkf` default makes bundle install, so we don't need to run it again
  runCommand('bundle', ['add', 'nkf'], appPath, logPath);
}

// iOS debug builds connect to Metro on 8081: `run ios --port` sets the port
// through the RCT_METRO_PORT macro, which the prebuilt React Native core has
// already compiled in. Instead, the app sets `jsLocation` — the setting behind
// Dev Menu > "Configure Bundler" — which the bundle URL and the packager
// connection (reload, dev menu from the Metro terminal) both read.
// It is set on every launch, also to 8081: the value persists in the app's
// user defaults, which outlive reinstalling the app.
// The code goes right before React Native starts, which the template does in
// AppDelegate and the UIScene setup
function setIosMetroLocation(config) {
  const appDelegatePath = path.join(
    config.paths.app,
    'ios',
    config.appName,
    'AppDelegate.swift',
  );
  const appDelegate = fs.readFileSync(appDelegatePath, 'utf8');
  const reactNativeStart = /^([ \t]*)let delegate = ReactNativeDelegate\(\)$/m;
  const indent = appDelegate.match(reactNativeStart)?.[1];
  if (indent === undefined) {
    throw new Error(
      `Cannot find 'let delegate = ReactNativeDelegate()' in ${appDelegatePath}.`,
    );
  }

  const setMetroLocation = `#if DEBUG
${indent}let deviceIp = Bundle.main.path(forResource: "ip", ofType: "txt")
${indent}  .flatMap { try? String(contentsOfFile: $0, encoding: .utf8) }?
${indent}  .trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
${indent}let metroHost = deviceIp.isEmpty ? "localhost" : deviceIp
${indent}RCTBundleURLProvider.sharedSettings().jsLocation = "\\(metroHost):${config['metro-port']}"
#endif

`;
  fs.writeFileSync(
    appDelegatePath,
    appDelegate.replace(reactNativeStart, match => setMetroLocation + match),
  );
}

function installIosPods(config, { runTask, runCommand }) {
  const { paths } = config;

  runTask('Installing iOS Pods', paths.log, () => {
    const iosDir = path.join(paths.app, 'ios');

    runCommand('bundle', ['install'], paths.app, paths.log);

    // Workaround for RN < 0.85 templates: Gemfile may lack `nkf`, which is
    // needed to `require 'kconv'` on Ruby 3.4+. RN 0.85 added `nkf` to the
    // template — remove this helper when we drop support for 0.84.
    // https://react-native-community.github.io/upgrade-helper/?from=0.84.1&to=0.85.0
    ensureNkfGem(paths.app, {
      runCommand,
      logPath: paths.log,
    });

    runCommand('bundle', ['exec', 'pod', 'install'], iosDir, paths.log);
  });
}

function buildAndroidRunArgs(config) {
  const args = [
    'run',
    'android',
    '--mode',
    config.variant,
    '--port',
    String(config['metro-port']),
  ];
  if (config['android-device']) {
    args.push('--device', config['android-device']);
  }
  return args;
}

function buildIosRunArgs(config) {
  const args = [
    'run',
    'ios',
    '--mode',
    config.capitalizedVariant,
    '--port',
    String(config['metro-port']),
  ];
  if (config['ios-udid']) {
    args.push('--udid', config['ios-udid']);
  } else if (config['ios-device']) {
    args.push('--device', config['ios-device']);
  } else if (config['ios-simulator']) {
    args.push('--simulator', config['ios-simulator']);
  }
  return args;
}

function buildAndRun(config, utils) {
  const { runTask, runCommand, freePort } = utils;
  const { paths, capitalizedVariant, platform } = config;
  const runIos = platform === 'ios' || platform === 'both';
  const runAndroid = platform === 'android' || platform === 'both';
  const metroPort = config['metro-port'];

  runTask(`Freeing Metro port ${metroPort}`, paths.log, () => {
    freePort(metroPort, paths.app);
  });

  if (runAndroid) {
    runTask(
      `Building & running Android (${capitalizedVariant})`,
      paths.log,
      () => {
        runCommand('yarn', buildAndroidRunArgs(config), paths.app, paths.log);
      },
    );
  }

  if (runIos) {
    runTask(`Pointing iOS app at Metro port ${metroPort}`, paths.log, () => {
      setIosMetroLocation(config);
    });

    installIosPods(config, utils);

    runTask(`Building & running iOS (${capitalizedVariant})`, paths.log, () => {
      runCommand('yarn', buildIosRunArgs(config), paths.app, paths.log);
    });
  }
}

module.exports = buildAndRun;
