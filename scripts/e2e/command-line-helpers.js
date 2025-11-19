const ChildProcess = require('node:child_process');
/**
 * Runs a command and returns it's response as string. The response is quaranteed to be one line
 * @param {string} command to run
 * @returns {string} command-line response
 */
function getOneLineCommandLineResponse (command) {
  const outputText = getCommandLineResponse(command)
  const response = outputText.split('\n').map(name => name.trim()).filter(Boolean);
  
  if (response.length === 1) {
    return response[0];
  }
  throw new Error(
    `One-line response expected. Reveived:\n${outputText}\n(${response.length} non-empty lines, ${outputText.length} total length)`
  );
}

/**
 * Runs a command and returns it's response as string
 * @param {string} command to run
 * @returns {string} command-line response
 */
function getCommandLineResponse (command) {
    const stdout = ChildProcess.execSync(command);
    // Possibly convert Buffer to string
    return typeof stdout === 'string' ? stdout : stdout.toString();
}

module.exports = {
    getOneLineCommandLineResponse,
    getCommandLineResponse,
}
