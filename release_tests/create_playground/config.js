const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');

const KNOWN_REF_TYPES = ['branch', 'tag', 'commit'];

function fatal(message) {
  console.error(`\n❌ FATAL ERROR: ${message}\n`);
  process.exit(1);
}

function parseScreensVersion(screensVersion) {
  if (screensVersion === 'current') {
    return { type: 'current', target: 'current' };
  }

  const separatorIndex = screensVersion.indexOf(':');
  if (separatorIndex === -1) {
    return { type: 'unknown', target: screensVersion };
  }

  const type = screensVersion.slice(0, separatorIndex);
  const target = screensVersion.slice(separatorIndex + 1);

  if (!KNOWN_REF_TYPES.includes(type)) {
    return { type: 'unknown', target: screensVersion };
  }

  if (!target) {
    fatal(
      `Invalid --screens-version '${screensVersion}'. Expected '${type}:<ref>' with a non-empty ref.`,
    );
  }

  return { type, target };
}

function getConfig() {
  const { values: config } = parseArgs({
    options: {
      'rn-version': {
        type: 'string',
        short: 'r',
        default: 'latest',
      },
      'screens-version': {
        type: 'string',
        short: 's',
        default: 'current',
      },
      variant: {
        type: 'string',
        short: 'v',
        default: 'debug',
      },
      help: {
        type: 'boolean',
        short: 'h',
        default: false,
      },
      'force-fetch': {
        type: 'boolean',
        short: 'f',
        default: false,
      },
      'example-app': {
        type: 'string',
        short: 'e',
        default: 'tabsAndStack',
      },
      gamma: {
        type: 'boolean',
        short: 'g',
        default: false,
      },
      platform: {
        type: 'string',
        short: 'p',
        default: 'both',
      },
      'app-name': {
        type: 'string',
        short: 'a',
        default: 'PlaygroundApp',
      },
      run: {
        type: 'boolean',
        default: false,
      },
      'ios-simulator': {
        type: 'string',
      },
      'ios-device': {
        type: 'string',
      },
      'ios-udid': {
        type: 'string',
      },
      'android-device': {
        type: 'string',
      },
    },
    strict: false,
  });

  if (config.help) {
    console.log(`
      Usage: node create_playground.js [options]

      Setup options:
        -r, --rn-version <version>       React Native version to install (default: 'latest')
        -s, --screens-version <version>  react-native-screens version. Default: 'current'.
                                         Accepts:
                                           current                       — current working tree
                                           branch:<name> | tag:<name>    — clone that branch or tag
                                           commit:<sha>                  — from local repo; use -f to fetch from remote
                                           <ref>                         — auto-detect branch, tag, or commit
                                         Ref versions prefer the local git repository when the ref
                                         exists there; otherwise they are taken from origin.
        -f, --force-fetch                Force fetch the screens version from the remote repository (origin).
                                         Use this to bypass the local git cache (e.g., after force pushes).
                                         Mutually exclusive with --screens-version 'current'.
        -e, --example-app <app>          Name of the example folder to copy (default: 'tabsAndStack').
                                         Copies 'App.tsx' from 'examples/<app>'. If a 'src' directory
                                         exists, it will also be copied. Use 'empty' to skip copying
                                         and keep the default RN App.tsx.
                                         Available: 'tabsAndStack' (Stack v5 from main export; RNS 5.x),
                                         'tabsAndStackExperimental' (Stack v5 from experimental; RNS 4.x + gamma),
                                         'tabsAndStack4.x' (legacy ScreenStack + Tabs; RNS 4.x, no gamma).
        -a, --app-name <name>            Name of the generated app folder under playground/ (default: 'PlaygroundApp').
                                         Must start with a letter and contain only letters and digits.
        -h, --help                       Display this help message

      Without --run: JS setup only (init, example, screens) — no pod install, no native compile,
      no launch. Run flags (-v, -p, -g, device flags) are not allowed.

      Run options (require --run):
            --run                        After setup: pod install (when platform is ios/both), build,
                                         install, and launch the app.
        -v, --variant <variant>          Build variant: 'debug' or 'release' (default: 'debug')
        -p, --platform <platform>        Platforms to build: 'ios', 'android', or 'both' (default: 'both')
        -g, --gamma                      Enable RNS_GAMMA_ENABLED=1 during pod install.
                                         Required when testing experimental Stack in RNS 4.x.
                                         Mutually exclusive with -p android.

      Device options (require --run):
            --ios-simulator <name>       iOS simulator name
            --ios-device <name>          Physical iOS device name
            --ios-udid <udid>            iOS device/simulator UDID
            --android-device <name>      Android device/emulator name (adb device id)

      Note: Device flags require --run. If omitted, RN CLI picks the device.
      iOS target flags (--ios-simulator, --ios-device, --ios-udid) are mutually exclusive.
      iOS device flags cannot be used with -p android, --android-device cannot be used with -p ios.

      Examples:
        # Setup only
        node create_playground.js
        node create_playground.js -s branch:main
        node create_playground.js -s tag:4.16.0
        node create_playground.js -s commit:8b939b9
        node create_playground.js -s commit:8b939b9 -f
        node create_playground.js -s main
        node create_playground.js -s branch:fix-bug -f
        node create_playground.js -a MyPlayground

        # Setup + run
        node create_playground.js --run
        node create_playground.js --run -v release
        node create_playground.js --run -p ios
        node create_playground.js --run -p ios --ios-simulator "iPhone 16"
        node create_playground.js --run -p ios --ios-device "Karol's iPhone"
        node create_playground.js --run -p android --android-device "emulator-5554"
        node create_playground.js -s 4.26-stable --run -g
        node create_playground.js -r 0.74.0 --run -v release
    `);
    process.exit(0);
  }

  const variant = config.variant.toLowerCase();
  if (!['debug', 'release'].includes(variant)) {
    fatal(
      `Unknown build variant: ${config.variant}. Allowed: 'debug', 'release'.`,
    );
  }

  const platform = config.platform.toLowerCase();
  if (!['ios', 'android', 'both'].includes(platform)) {
    fatal(
      `Unknown platform: ${config.platform}. Allowed: 'ios', 'android', 'both'.`,
    );
  }

  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(config['app-name'])) {
    fatal(
      `Invalid app name: ${config['app-name']}. Must start with a letter and contain only letters and digits.`,
    );
  }

  const { type: screensRefType, target: screensRefTarget } =
    parseScreensVersion(config['screens-version']);

  if (screensRefType === 'current' && config['force-fetch']) {
    fatal(
      `Invalid flag combination. You cannot use '--force-fetch' when '--screens-version' is set to 'current'.\n` +
        `Explanation: The 'current' option uses your current working directory directly. Fetching from origin only applies when you target a specific branch or commit (e.g., -s branch:main -f).\n`,
    );
  }

  const iosSimulator = config['ios-simulator'];
  const iosDevice = config['ios-device'];
  const iosUdid = config['ios-udid'];
  const androidDevice = config['android-device'];

  const iosTargetFlags = [
    iosSimulator && '--ios-simulator',
    iosDevice && '--ios-device',
    iosUdid && '--ios-udid',
  ].filter(Boolean);

  if (iosTargetFlags.length > 1) {
    fatal(
      `Conflicting iOS target flags: ${iosTargetFlags.join(
        ', ',
      )}. Use only one of --ios-simulator, --ios-device, or --ios-udid.`,
    );
  }

  if (platform === 'ios' && androidDevice) {
    fatal(`Cannot use '--android-device' when '--platform' is 'ios'.`);
  }

  if (platform === 'android' && iosTargetFlags.length > 0) {
    fatal(
      `Cannot use iOS device flags (${iosTargetFlags.join(
        ', ',
      )}) when '--platform' is 'android'.`,
    );
  }

  const run = Boolean(config.run);

  if (run && config.gamma && platform === 'android') {
    fatal(`Cannot use '--gamma' when '--platform' is 'android'.`);
  }
  const argvHasFlag = (...flags) =>
    flags.some(flag => process.argv.includes(flag));

  const runOnlyFlags = [
    argvHasFlag('-v', '--variant') && '-v/--variant',
    argvHasFlag('-p', '--platform') && '-p/--platform',
    argvHasFlag('-g', '--gamma') && '-g/--gamma',
    iosSimulator && '--ios-simulator',
    iosDevice && '--ios-device',
    iosUdid && '--ios-udid',
    androidDevice && '--android-device',
  ].filter(Boolean);

  if (runOnlyFlags.length > 0 && !run) {
    fatal(
      `Flags ${runOnlyFlags.join(
        ', ',
      )} require '--run'. They only apply when building and launching the app.`,
    );
  }

  const releaseTests = path.resolve(__dirname, '..');
  const appName = config['app-name'];
  const playground = path.join(releaseTests, 'playground');

  if (config['example-app'] !== 'empty') {
    const exampleAppFile = path.join(
      releaseTests,
      'examples',
      config['example-app'],
      'App.tsx',
    );
    if (!fs.existsSync(exampleAppFile)) {
      fatal(
        `File ${exampleAppFile} not found. Please ensure the example exists.`,
      );
    }
  }

  return {
    ...config,
    variant,
    run,
    'ios-simulator': iosSimulator,
    'ios-device': iosDevice,
    'ios-udid': iosUdid,
    'android-device': androidDevice,
    'screens-ref-type': screensRefType,
    'screens-ref-target': screensRefTarget,
    platform,
    capitalizedVariant: variant.charAt(0).toUpperCase() + variant.slice(1),
    appName,
    paths: {
      releaseTests,
      playground,
      screens: path.resolve(releaseTests, '..'),
      app: path.join(playground, appName),
      log: path.join(releaseTests, 'setup.log'),
    },
  };
}

module.exports = getConfig;
