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
  },
  strict: false,
});

if (config.help) {
  console.log(`
      Usage: node setup.js [options]
      
      Options:
        -r, --rn-version <version>       React Native version to install (default: 'latest')
        -s, --screens-version <version>  react-native-screens version (branch, tag, or commit). Default: 'local'.
                                         If a specific version is provided, the script will try to clone it 
                                         from your local git repository first. 
                                         Note: If using a specific commit hash, it must be already fetched 
                                         in your local repository.
        -f, --force-fetch                Force fetch the screens version from the remote repository (origin).
                                         Use this to bypass the local git cache (e.g., after force pushes).
                                         Mutually exclusive with --screens-version 'local'.
        -v, --variant <variant>          Build variant: 'debug' or 'release' (default: 'debug')
        -e, --example-app <app>          Name of the example folder to copy (default: 'tabsAndStack').
                                         Copies 'App.tsx' from 'examples/<app>'. If a 'src' directory 
                                         exists, it will also be copied. Use 'empty' to skip copying 
                                         and keep the default RN App.tsx.
        -h, --help                       Display this help message
      
      Examples:
        node setup.js                                   # Runs with defaults (latest, local, debug)
        node setup.js -s main                           # Clones the local 'main' branch of screens
        node setup.js -s 8b939b9                        # Clones a specific commit (must be fetched locally)
        node setup.js -s fix-bug -f                     # Forces fetching 'fix-bug' branch from remote origin
        node setup.js -r 0.74.0 -v release              # Combine short flags
    `);
  process.exit(0);
}

if (!['debug', 'release'].includes(config.variant.toLowerCase())) {
  console.error(
    `\n❌ FATAL ERROR: Unknown build variant: ${config.variant}. Allowed: 'debug', 'release'.\n`,
  );
  process.exit(1);
}

if (config['screens-version'] === 'local' && config['force-fetch']) {
  console.error(
    `\n❌ FATAL ERROR: Invalid flag combination. You cannot use '--force-fetch' when '--screens-version' is set to 'local'.`,
  );
  console.error(
    `Explanation: The 'local' option uses your current working directory directly. Fetching from origin only applies when you target a specific branch or commit (e.g., -s main -f).\n`,
  );
  process.exit(1);
}

const capitalizedVariant =
  config.variant.charAt(0).toUpperCase() +
  config.variant.slice(1).toLowerCase();

// console.log('⚙️  Script started with configuration:');
// console.table(config);
// console.log('--------------------------------------------------');

// ========================================================
const RELEASE_TESTS_DIR = __dirname;
const SCREENS_DIR = path.resolve(RELEASE_TESTS_DIR, '..');
const APP_NAME = 'PlaygroundApp';
const APP_DIR = path.join(RELEASE_TESTS_DIR, APP_NAME);
const LOG_FILE = path.join(RELEASE_TESTS_DIR, 'setup.log');

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

if (config['example-app'] === 'empty') {
  console.log(`🔍 No example app selected. Skipping...\n`);
} else {
  runTask(`Copying example App file and src directory`, () => {
    const exampleDir = path.join(
      RELEASE_TESTS_DIR,
      'examples',
      config['example-app'],
    );

    const sourceAppFile = path.join(exampleDir, 'App.tsx');
    const targetAppFile = path.join(APP_DIR, 'App.tsx');

    if (!fs.existsSync(sourceAppFile)) {
      console.error(
        `\n❌ FATAL ERROR: File ${sourceAppFile} not found. Please ensure the example exists.`,
      );
      process.exit(1);
    } else {
      fs.copyFileSync(sourceAppFile, targetAppFile);
    }

    const sourceSrcDir = path.join(exampleDir, 'src');
    const targetSrcDir = path.join(APP_DIR, 'src');

    if (fs.existsSync(sourceSrcDir)) {
      fs.cpSync(sourceSrcDir, targetSrcDir, { recursive: true, force: true });
    }
  });
}

if (config['screens-version'] === 'local') {
  const packFileName = 'screens-local.tgz';
  const packFile = path.join(APP_DIR, packFileName);

  runTask(
    'Installing screens library dependencies from local directory',
    () => {
      runCommand('yarn install', SCREENS_DIR);
    },
  );

  runTask('Building screens library', () => {
    runCommand('yarn prepare', SCREENS_DIR);
  });

  runTask('Packing local screens library', () => {
    const output = runCommand('npm pack', SCREENS_DIR, true);
    const rawPackFile = output.trim().split('\n').pop();

    fs.renameSync(path.join(SCREENS_DIR, rawPackFile), packFile);
    fs.appendFileSync(LOG_FILE, `Moved packed file to: ${packFile}\n`);
  });

  runTask('Installing packed package in app', () => {
    fs.writeFileSync(path.join(APP_DIR, 'yarn.lock'), '');
    runCommand(`yarn add ./${packFileName}`, APP_DIR);
  });
} else {
  const tempCloneDir = fs.mkdtempSync(path.join(os.tmpdir(), 'screens-clone-'));
  const targetVersion = config['screens-version'];
  const packFileName = 'screens-remote.tgz';
  const packFile = path.join(APP_DIR, packFileName);

  runTask(
    `Preparing target version (${targetVersion}) in temporary directory`,
    () => {
      let needsFetch = config['force-fetch'];

      const remoteUrl = execSync('git config --get remote.origin.url', {
        cwd: SCREENS_DIR,
      })
        .toString()
        .trim();

      runCommand(
        `git clone "${SCREENS_DIR}" "${tempCloneDir}"`,
        RELEASE_TESTS_DIR,
      );

      if (!needsFetch) {
        try {
          execSync(`git rev-parse --verify ${targetVersion}`, {
            cwd: tempCloneDir,
            stdio: 'ignore',
          });
        } catch (localError) {
          needsFetch = true;
        }
      }

      if (needsFetch) {
        console.log(
          `\n☁️ Fetching version '${targetVersion}' from the network (${remoteUrl})...`,
        );

        try {
          execSync(`git fetch ${remoteUrl} ${targetVersion}:${targetVersion}`, {
            cwd: tempCloneDir,
            stdio: 'ignore',
          });
        } catch (remoteError) {
          console.error(
            `\n❌ FATAL ERROR: Version '${targetVersion}' was not found locally or on the network.`,
          );
          fs.rmSync(tempCloneDir, { recursive: true, force: true });
          process.exit(1);
        }
      }

      runCommand(`git checkout ${targetVersion}`, tempCloneDir);

      console.log(`\n📦 Building package in an isolated environment...\n`);
      runCommand('yarn install', tempCloneDir);
      runCommand('yarn prepare', tempCloneDir);

      const output = runCommand('npm pack', tempCloneDir, true);
      const rawPackFile = output.trim().split('\n').pop();

      fs.copyFileSync(path.join(tempCloneDir, rawPackFile), packFile);
      fs.appendFileSync(
        LOG_FILE,
        `Copied packed file from tmp to: ${packFile}\n`,
      );
      fs.rmSync(tempCloneDir, { recursive: true, force: true });
    },
  );

  runTask('Installing packed package in app', () => {
    fs.writeFileSync(path.join(APP_DIR, 'yarn.lock'), '');
    runCommand(`yarn add ./${packFileName}`, APP_DIR);
  });
}

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

console.log(`🎉 All steps completed successfully!\n`);

console.timeEnd('⏳ Total execution time');
