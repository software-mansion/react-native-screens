const ChildProcess = require('node:child_process');
/**
 * Runs a command and returns its response as a string
 * @param {string} command - The command to run.
 * @returns {string} command-line response
 */
function getCommandLineResponse(command) {
  try {
    return ChildProcess.execSync(command, { encoding: 'utf-8' });
  } catch (e) {
    throw new Error(
      `Execution command "${command}" failed! Reason:\n${
        /** @type {Error} */ (e).message
      }`,
    );
  }
}

module.exports = {
  getCommandLineResponse,
};
