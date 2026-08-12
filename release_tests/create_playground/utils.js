const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, execSync } = require('child_process');
const logger = require('./logger');

const CAPTURE_MAX_BUFFER = 64 * 1024 * 1024;
const METRO_PORT = 8081;

function formatCommand(file, args = []) {
  return [file, ...args].join(' ');
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

function freePort(port = METRO_PORT) {
  try {
    execSync(`lsof -tiTCP:${port} -sTCP:LISTEN | xargs kill -9`, {
      stdio: 'ignore',
    });
  } catch {
    // nothing listening on the port
  }
}

module.exports = {
  runCommand,
  runTask,
  withTempDir,
  freePort,
  METRO_PORT,
};
