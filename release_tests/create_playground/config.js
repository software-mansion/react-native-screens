const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');
const { fatal } = require('./utils');

const CURRENT_SCREENS_VERSION = 'current';
const KNOWN_REF_TYPES = ['branch', 'tag', 'commit'];
const SCREENS_VERSION_HELP = `'${CURRENT_SCREENS_VERSION}', 'branch:<name>', 'tag:<name>', or 'commit:<sha>'`;
const EMPTY_EXAMPLE_APP = 'empty';

function parseScreensVersion(screensVersion) {
  if (screensVersion === CURRENT_SCREENS_VERSION) {
    return { type: CURRENT_SCREENS_VERSION, target: CURRENT_SCREENS_VERSION };
  }

  const separatorIndex = screensVersion.indexOf(':');
  if (separatorIndex === -1) {
    fatal(
      `Invalid --screens-version '${screensVersion}'. Expected ${SCREENS_VERSION_HELP}.`,
    );
  }

  const type = screensVersion.slice(0, separatorIndex);
  const target = screensVersion.slice(separatorIndex + 1);

  if (!KNOWN_REF_TYPES.includes(type)) {
    fatal(
      `Invalid --screens-version '${screensVersion}'. Unknown type '${type}'. Expected ${SCREENS_VERSION_HELP}.`,
    );
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
        default: CURRENT_SCREENS_VERSION,
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
      'from-origin': {
        type: 'boolean',
        short: 'o',
        default: false,
      },
      'example-app': {
        type: 'string',
        short: 'e',
        default: 'tabsAndStack',
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
        -s, --screens-version <version>  react-native-screens version. Default: '${CURRENT_SCREENS_VERSION}'.
                                         Accepts:
                                           ${CURRENT_SCREENS_VERSION}                       — current working tree
                                           branch:<name> | tag:<name>    — clone that branch or tag
                                           commit:<sha>                  — checkout that commit
                                         Use '${CURRENT_SCREENS_VERSION}' for the working tree, or a typed ref
                                         (branch:/tag:/commit:). Typed refs are taken from the
                                         local git repository; pass -o to take them from origin.
        -o, --from-origin                Take the screens version from the remote repository (origin)
                                         instead of the local git repository.
                                         Mutually exclusive with --screens-version '${CURRENT_SCREENS_VERSION}'.
        -e, --example-app <app>          Name of the example folder to copy (default: 'tabsAndStack').
                                         Copies 'App.tsx' from 'examples/<app>'. If a 'src' directory
                                         exists, it will also be copied. Use '${EMPTY_EXAMPLE_APP}' to skip copying
                                         and keep the default RN App.tsx.
                                         Available: 'tabsAndStack' (Stack v5 from main export; RNS 5.x),
                                         'tabsAndStack4.x' (legacy ScreenStack + Tabs; RNS 4.x).
        -a, --app-name <name>            Name of the generated app folder under playground/ (default: 'PlaygroundApp').
                                         Must start with a letter and contain only letters and digits.
        -h, --help                       Display this help message

      Without --run: JS setup only (init, example, screens) — no pod install, no native compile,
      no launch. Run flags (-v, -p, device flags) are not allowed.

      Run options (require --run):
            --run                        After setup: pod install (when platform is ios/both), build,
                                         install, and launch the app.
        -v, --variant <variant>          Build variant: 'debug' or 'release' (default: 'debug')
        -p, --platform <platform>        Platforms to build: 'ios', 'android', or 'both' (default: 'both')

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
        node create_playground.js -s commit:8b939b9 -o
        node create_playground.js -s branch:fix-bug -o
        node create_playground.js -a MyPlayground

        # Setup + run
        node create_playground.js --run
        node create_playground.js --run -v release
        node create_playground.js --run -p ios
        node create_playground.js --run -p ios --ios-simulator "iPhone 16"
        node create_playground.js --run -p ios --ios-device "Karol's iPhone"
        node create_playground.js --run -p android --android-device "emulator-5554"
        node create_playground.js -s branch:4.26-stable --run -e tabsAndStack4.x
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

  if (screensRefType === CURRENT_SCREENS_VERSION && config['from-origin']) {
    fatal(
      `Invalid flag combination. You cannot use '--from-origin' when '--screens-version' is set to '${CURRENT_SCREENS_VERSION}'.\n` +
        `Explanation: The '${CURRENT_SCREENS_VERSION}' option uses your current working directory directly. Taking the ref from origin only applies when you target a specific branch, tag, or commit (e.g., -s branch:main -o).\n`,
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

  const argvHasFlag = (...flags) =>
    flags.some(flag => process.argv.includes(flag));

  const runOnlyFlags = [
    argvHasFlag('-v', '--variant') && '-v/--variant',
    argvHasFlag('-p', '--platform') && '-p/--platform',
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

  if (config['example-app'] !== EMPTY_EXAMPLE_APP) {
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
module.exports.CURRENT_SCREENS_VERSION = CURRENT_SCREENS_VERSION;
module.exports.EMPTY_EXAMPLE_APP = EMPTY_EXAMPLE_APP;
