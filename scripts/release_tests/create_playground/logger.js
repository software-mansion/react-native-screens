const fs = require('fs');

function initLog(logFile) {
  fs.writeFileSync(
    logFile,
    `Script started at ${new Date().toLocaleString()}\n`,
  );
  console.log(`📋 All logs are being written to: ${logFile}`);
  console.log('--------------------------------------------------');
}

function append(logFile, text) {
  fs.appendFileSync(logFile, text);
}

function printTail(logFile, n = 20) {
  const logs = fs.readFileSync(logFile, 'utf-8').trim().split('\n');
  console.log(logs.slice(-n).join('\n'));
}

module.exports = { initLog, append, printTail };
