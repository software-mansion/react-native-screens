const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const logger = require('./logger');

const CAPTURE_MAX_BUFFER = 64 * 1024 * 1024;
const METRO_PORT = 8081;

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

function isMetroRespondingOnPort(port) {
  try {
    const response = execFileSync(
      'curl',
      ['-s', '--max-time', '2', `http://localhost:${port}/status`],
      { encoding: 'utf8' },
    );
    return response.includes('packager-status:running');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Cannot check Metro status on port ${port}: 'curl' is not installed.`,
      );
    }
    return false;
  }
}

function freePort(port = METRO_PORT) {
  let pids;
  try {
    pids = execFileSync('lsof', [`-tiTCP:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Cannot free port ${port}: 'lsof' is not installed (required to detect Metro).`,
      );
    }
    if (typeof error?.status === 'number' && error.status === 1) {
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
  if (!isMetroRespondingOnPort(port)) {
    throw new Error(
      `Port ${port} is held by PID ${pids[0]}, which does not respond like Metro.`,
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
  METRO_PORT,
};
