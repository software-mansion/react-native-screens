const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseArgs } = require('util');

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
  },
  strict: false,
});

if (config.help) {
  console.log(`
  Usage: node setup.js [options]
  
  Options:
    -r, --rn-version <version>       React Native version to install (default: 'latest')
    -s, --screens-version <version>  react-native-screens version (currently supports only: 'local')
    -v, --variant <variant>          Build variant: 'debug' or 'release' (default: 'debug')
    -h, --help                       Display this help message
  
  Examples:
    node setup.js                                   # Runs with defaults (latest, local, debug)
    node setup.js -r 0.81.0                         # Tests specific RN version
    node setup.js -v release                        # Builds release APK/App
    node setup.js -r 0.74.0 -v release              # Combine short flags
    `);
  process.exit(0);
}

if (config['screens-version'] !== 'local') {
  console.error(
    `\n❌ FATAL ERROR: Fetching a version from the network is not supported yet.`,
  );
  console.error(`Received: --screens-version ${config['screens-version']}`);
  console.error(`Currently only the value 'local' is supported.\n`);
  process.exit(1);
}

if (!['debug', 'release'].includes(config.variant.toLowerCase())) {
  console.error(
    `\n❌ FATAL ERROR: Unknown build variant: ${config.variant}. Allowed: 'debug', 'release'.\n`,
  );
  process.exit(1);
}

const capitalizedVariant =
  config.variant.charAt(0).toUpperCase() +
  config.variant.slice(1).toLowerCase();

console.log('⚙️  Script started with configuration:');
console.table(config);
console.log('--------------------------------------------------');

// ========================================================
const RELEASE_TESTS_DIR = __dirname;
const SCREENS_DIR = path.resolve(RELEASE_TESTS_DIR, '..');
const APP_NAME = 'PlaygroundApp';
const APP_DIR = path.join(RELEASE_TESTS_DIR, APP_NAME);
const EXAMPLE_APP_FILE = path.join(RELEASE_TESTS_DIR, 'example_App.txt');
const APP_MAIN_FILE = path.join(APP_DIR, 'App.tsx');
const LOG_FILE = path.join(RELEASE_TESTS_DIR, 'setup.log');

const PACK_FILE_NAME = 'screens-local.tgz';
const PACK_FILE = path.join(APP_DIR, PACK_FILE_NAME);

console.log(`📋 All logs are being written to: ${LOG_FILE}`);
console.log('--------------------------------------------------');

function runTask(taskName, executeFn) {
  console.log(`⏳ Starting: ${taskName}...`);
  const time = new Date().toLocaleString();
  fs.appendFileSync(LOG_FILE, `\n=== [${time}] TASK: ${taskName} ===\n`);

  try {
    executeFn();
    console.log(`✅ Finished: ${taskName}\n`);
  } catch (error) {
    console.log(`\n❌ ERROR: Failed during task: '${taskName}'`);
    console.log('--------------------------------------------------');
    console.log(`🔍 Last 20 lines of log output (${LOG_FILE}):`);
    console.log('--------------------------------------------------');

    const logs = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n');
    console.log(logs.slice(-20).join('\n'));

    console.log('--------------------------------------------------');
    console.log(`💡 Check ${LOG_FILE} for the full output.`);
    process.exit(1);
  }
}

function runCommand(cmd, cwd = RELEASE_TESTS_DIR, captureOutput = false) {
  fs.appendFileSync(LOG_FILE, `=== COMMAND: ${cmd} ===\n`);

  if (captureOutput) {
    try {
      const output = execSync(cmd, { cwd, stdio: 'pipe' }).toString();
      fs.appendFileSync(LOG_FILE, output + '\n');
      return output;
    } catch (error) {
      fs.appendFileSync(LOG_FILE, error.stdout?.toString() || '');
      fs.appendFileSync(LOG_FILE, error.stderr?.toString() || '');
      throw error;
    }
  } else {
    const logFd = fs.openSync(LOG_FILE, 'a');
    execSync(cmd, { cwd, stdio: ['ignore', logFd, logFd] });
    fs.closeSync(logFd);
  }
}

// ==================================================
// TASKS EXECUTION (MAIN FLOW)
// ==================================================

console.time('⏳ Total execution time');

runTask('Cleaning old app folder', () => {
  fs.rmSync(APP_DIR, { recursive: true, force: true });
  fs.appendFileSync(LOG_FILE, `Removed directory: ${APP_DIR}\n`);
});

runTask('Initializing React Native app', () => {
  runCommand(
    `npx @react-native-community/cli@latest init ${APP_NAME} --version ${config['rn-version']} --skip-install`,
    RELEASE_TESTS_DIR,
  );
});

runTask('Copying example App file', () => {
  fs.copyFileSync(EXAMPLE_APP_FILE, APP_MAIN_FILE);
  fs.appendFileSync(
    LOG_FILE,
    `Copied ${EXAMPLE_APP_FILE} to ${APP_MAIN_FILE}\n`,
  );
});

runTask('Installing screens library dependencies', () => {
  runCommand('yarn install', SCREENS_DIR);
});

runTask('Building screens library', () => {
  runCommand('yarn prepare', SCREENS_DIR);
});

runTask('Packing local screens library', () => {
  const output = runCommand('npm pack', SCREENS_DIR, true);
  const rawPackFile = output.trim().split('\n').pop();

  fs.renameSync(path.join(SCREENS_DIR, rawPackFile), PACK_FILE);
  fs.appendFileSync(LOG_FILE, `Moved packed file to: ${PACK_FILE}\n`);
});

runTask('Installing packed package in app', () => {
  fs.writeFileSync(path.join(APP_DIR, 'yarn.lock'), '');
  runCommand(`yarn add ./${PACK_FILE_NAME}`, APP_DIR);
});

runTask('Installing iOS Pods', () => {
  runCommand(
    'bundle install && bundle exec pod install',
    path.join(APP_DIR, 'ios'),
  );
});

runTask(`Building Android APK (${capitalizedVariant})`, () => {
  runCommand(
    `./gradlew assemble${capitalizedVariant}`,
    path.join(APP_DIR, 'android'),
  );
});

runTask(`Building iOS App (${capitalizedVariant})`, () => {
  runCommand(
    `xcodebuild -workspace ${APP_NAME}.xcworkspace -scheme ${APP_NAME} -configuration ${capitalizedVariant} -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO`,
    path.join(APP_DIR, 'ios'),
  );
});

console.log('🎉 All steps completed successfully!');

console.timeEnd('⏳ Total execution time');
