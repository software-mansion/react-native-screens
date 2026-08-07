const fs = require('fs');
const { execSync, spawn } = require('child_process');
const logger = require('./logger');

const CAPTURE_MAX_BUFFER = 64 * 1024 * 1024;
const METRO_PORT = 8081;

function runCommand(cmd, cwd, logFile, captureOutput = false) {
  logger.append(logFile, `=== COMMAND: ${cmd} ===\n`);
  console.log(`🔍 Running command: ${cmd}`);
  if (captureOutput) {
    try {
      const output = execSync(cmd, {
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
    execSync(cmd, { cwd, stdio: ['ignore', logFd, logFd] });
    fs.closeSync(logFd);
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
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
  } catch {
    // nothing listening on the port
  }
}

function startMetro(cwd, logFile) {
  logger.append(logFile, `=== COMMAND: yarn start (background, port ${METRO_PORT}) ===\n`);
  console.log(`🔍 Starting Metro on port ${METRO_PORT}...`);

  const logFd = fs.openSync(logFile, 'a');
  const child = spawn('yarn', ['start', '--port', String(METRO_PORT)], {
    cwd,
    stdio: ['ignore', logFd, logFd],
    detached: true,
  });

  child.unref();

  // Give Metro a moment to bind the port before run-android / run-ios.
  execSync('sleep 3');

  return child;
}

module.exports = {
  runCommand,
  runTask,
  freePort,
  startMetro,
  METRO_PORT,
};
