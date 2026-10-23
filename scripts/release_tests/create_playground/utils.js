const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const logger = require('./logger');

const CAPTURE_MAX_BUFFER = 64 * 1024 * 1024;

function fatal(message) {
  console.error(`\n❌ FATAL ERROR: ${message}\n`);
  process.exit(1);
}

function formatCommand(file, args = []) {
  return [file, ...args]
    .map(arg => (arg.includes(' ') ? `"${arg}"` : arg))
    .join(' ');
}

function withTempDir(prefix, fn) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  };

  const onSignal = () => {
    cleanup();
    process.exit(130);
  };

  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    return fn(tempDir);
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    cleanup();
  }
}

function runCommand(file, args, cwd, logFile, captureOutput = false) {
  const cmd = formatCommand(file, args);
  logger.append(logFile, `=== COMMAND: ${cmd} ===\n`);
  console.log(`🔍 Running command: ${cmd}`);
  if (captureOutput) {
    try {
      const output = execFileSync(file, args, {
        cwd,
        stdio: 'pipe',
        maxBuffer: CAPTURE_MAX_BUFFER,
      }).toString();
      logger.append(logFile, output + '\n');
      return output;
    } catch (error) {
      logger.append(logFile, error.stdout?.toString() || '');
      logger.append(logFile, error.stderr?.toString() || '');
      throw error;
    }
  } else {
    const logFd = fs.openSync(logFile, 'a');
    try {
      execFileSync(file, args, { cwd, stdio: ['ignore', logFd, logFd] });
    } finally {
      fs.closeSync(logFd);
    }
  }
}

function runTask(taskName, logFile, executeFn) {
  console.log(`⏳ Starting: ${taskName}...`);
  const time = new Date().toLocaleString();
  logger.append(logFile, `\n=== [${time}] TASK: ${taskName} ===\n`);

  try {
    executeFn();
    console.log(`✅ Finished: ${taskName}\n`);
  } catch (error) {
    console.log(`\n❌ ERROR: Failed during task: '${taskName}'`);
    console.log('--------------------------------------------------');
    console.log(`ERROR MESSAGE: ${error.message}`);
    console.log('--------------------------------------------------');
    console.log(`🔍 Last 20 lines of log output (${logFile}):`);
    console.log('--------------------------------------------------');

    logger.printTail(logFile, 20);

    console.log('--------------------------------------------------');
    console.log(`💡 Check ${logFile} for the full output.`);
    process.exit(1);
  }
}

function getMetroProjectRoot(port) {
  try {
    const response = execFileSync(
      'curl',
      ['-s', '-i', '--max-time', '2', `http://localhost:${port}/status`],
      { encoding: 'utf8' },
    );
    if (!response.includes('packager-status:running')) {
      return null;
    }
    const rootHeader = response.match(
      /^x-react-native-project-root:[ \t]*(.*?)\r?$/im,
    );
    return rootHeader?.[1] ?? '';
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Cannot check Metro status on port ${port}: 'curl' is not installed.`,
      );
    }
    return null;
  }
}

function isSameDir(a, b) {
  const normalize = dir => {
    try {
      return fs.realpathSync(dir);
    } catch {
      return path.resolve(dir);
    }
  };
  return normalize(a) === normalize(b);
}

function freePort(port, appPath) {
  let pids;
  try {
    pids = execFileSync('lsof', [`-tiTCP:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  } catch (error) {
    // lsof exits 1 with empty stderr when the listen address is not found
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Cannot free port ${port}: 'lsof' is not installed (required to detect Metro).`,
      );
    }
    if (
      typeof error?.status === 'number' &&
      error.status === 1 &&
      error.stderr?.toString()?.trim() === ''
    ) {
      return; // nothing listening on the port
    }
    throw error;
  }

  if (pids.length === 0) {
    return; // nothing listening on the port
  }

  if (pids.length > 1) {
    throw new Error(
      `Port ${port} is held by multiple processes (PIDs: ${pids.join(', ')}).`,
    );
  }
  const metroRoot = getMetroProjectRoot(port);
  if (metroRoot === null) {
    throw new Error(
      `Port ${port} is held by PID ${pids[0]}, which does not respond like Metro.`,
    );
  }
  if (!metroRoot || !isSameDir(metroRoot, appPath)) {
    throw new Error(
      `Port ${port} is used by Metro serving '${
        metroRoot || 'an unknown project'
      }' (PID ${pids[0]}). ` +
        `Stop it (kill ${pids[0]}) or pass another --metro-port.`,
    );
  }
  terminateProcess(Number(pids[0]));
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0); // signal 0 only checks existence
    return true;
  } catch {
    return false;
  }
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function terminateProcess(pid, gracePeriodMs = 3000) {
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    return; // already gone
  }

  const deadline = Date.now() + gracePeriodMs;
  while (Date.now() < deadline) {
    if (!isProcessAlive(pid)) {
      return;
    }
    sleepSync(100);
  }

  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // exited between the last check and the kill
  }
}

module.exports = {
  fatal,
  runCommand,
  runTask,
  withTempDir,
  freePort,
};
