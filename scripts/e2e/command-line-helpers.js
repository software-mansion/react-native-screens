const ChildProcess = require('node:child_process');
/**
 * Runs a command and returns it's response as string
 * @param {string} command - The command to run.
 * @returns {string} command-line response
 */
function getCommandLineResponse(command) {
  const stdout = ChildProcess.execSync(command);
  // Possibly convert Buffer to string
  return typeof stdout === 'string' ? stdout : stdout.toString();
}

module.exports = {
  getCommandLineResponse,
};
