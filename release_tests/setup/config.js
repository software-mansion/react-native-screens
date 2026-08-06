const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');

const KNOWN_REF_TYPES = ['branch', 'tag', 'commit'];

function parseScreensVersion(screensVersion) {
  if (screensVersion === 'local') {
    return { type: 'local', target: 'local' };
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
    console.error(
      `\n❌ FATAL ERROR: Invalid --screens-version '${screensVersion}'. Expected '${type}:<ref>' with a non-empty ref.\n`,
    );
    process.exit(1);
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
        default: 'local',
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
    },
    strict: false,
  });

  if (config.help) {
    console.log(`
      Usage: node setup_app.js [options]
      
      Options:
        -r, --rn-version <version>       React Native version to install (default: 'latest')
        -s, --screens-version <version>  react-native-screens version. Default: 'local'.
                                         Accepts:
                                           local                         — current working tree
                                           branch:<name> | tag:<name>    — clone that branch or tag
                                           commit:<sha>                  — from local repo; use -f to fetch from remote
                                           <ref>                         — auto-detect branch, tag, or commit
                                         Non-local versions prefer the local git repository when the ref
                                         exists there; otherwise they are taken from origin.
        -f, --force-fetch                Force fetch the screens version from the remote repository (origin).
                                         Use this to bypass the local git cache (e.g., after force pushes).
                                         Required to fetch a commit from remote (-s commit:<sha> -f).
                                         Mutually exclusive with --screens-version 'local'.
        -v, --variant <variant>          Build variant: 'debug' or 'release' (default: 'debug')
        -p, --platform <platform>        Platforms to build: 'ios', 'android', or 'both' (default: 'both')
        -a, --app-name <name>            Name of the generated app folder under playground/ (default: 'PlaygroundApp').
                                         Must start with a letter and contain only letters and digits.
        -e, --example-app <app>          Name of the example folder to copy (default: 'tabsAndStack').
                                         Copies 'App.tsx' from 'examples/<app>'. If a 'src' directory 
                                         exists, it will also be copied. Use 'empty' to skip copying 
                                         and keep the default RN App.tsx.
                                         Available: 'tabsAndStack' (Stack v5 from main export; RNS 5.x),
                                         'tabsAndStackExperimental' (Stack v5 from experimental; RNS 4.x + gamma),
                                         'tabsAndStack4.x' (legacy ScreenStack + Tabs; RNS 4.x, no gamma).
        -g, --gamma                      Enable RNS_GAMMA_ENABLED=1 during pod install.
                                         Required when testing experimental Stack implementation in RNS 4.x.
        -h, --help                       Display this help message
      
      Examples:
        node setup_app.js                                   # Runs with defaults (latest, local, debug)
        node setup_app.js -s branch:main                    # Clone branch
        node setup_app.js -s tag:4.16.0                     # Clone tag
        node setup_app.js -s commit:8b939b9                 # Commit from local repo
        node setup_app.js -s commit:8b939b9 -f              # Commit from remote origin
        node setup_app.js -s main                           # Auto-detect ref type
        node setup_app.js -s branch:fix-bug -f              # Force-fetch branch from remote origin
        node setup_app.js -s 4.26-stable -g                 # Enable gamma flag for experimental stack in 4.x
        node setup_app.js -r 0.74.0 -v release              # Combine short flags
        node setup_app.js -p ios                            # Build iOS only
        node setup_app.js -a MyPlayground                   # Generate app under playground/MyPlayground
    `);
    process.exit(0);
  }

  if (!['debug', 'release'].includes(config.variant.toLowerCase())) {
    console.error(
      `\n❌ FATAL ERROR: Unknown build variant: ${config.variant}. Allowed: 'debug', 'release'.\n`,
    );
    process.exit(1);
  }

  if (!['ios', 'android', 'both'].includes(config.platform.toLowerCase())) {
    console.error(
      `\n❌ FATAL ERROR: Unknown platform: ${config.platform}. Allowed: 'ios', 'android', 'both'.\n`,
    );
    process.exit(1);
  }

  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(config['app-name'])) {
    console.error(
      `\n❌ FATAL ERROR: Invalid app name: ${config['app-name']}. Must start with a letter and contain only letters and digits.\n`,
    );
    process.exit(1);
  }

  const { type: screensRefType, target: screensRefTarget } =
    parseScreensVersion(config['screens-version']);

  if (screensRefType === 'local' && config['force-fetch']) {
    console.error(
      `\n❌ FATAL ERROR: Invalid flag combination. You cannot use '--force-fetch' when '--screens-version' is set to 'local'.`,
    );
    console.error(
      `Explanation: The 'local' option uses your current working directory directly. Fetching from origin only applies when you target a specific branch or commit (e.g., -s branch:main -f).\n`,
    );
    process.exit(1);
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
      console.error(
        `\n❌ FATAL ERROR: File ${exampleAppFile} not found. Please ensure the example exists.\n`,
      );
      process.exit(1);
    }
  }

  return {
    ...config,
    'screens-ref-type': screensRefType,
    'screens-ref-target': screensRefTarget,
    platform: config.platform.toLowerCase(),
    capitalizedVariant:
      config.variant.charAt(0).toUpperCase() +
      config.variant.slice(1).toLowerCase(),
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
