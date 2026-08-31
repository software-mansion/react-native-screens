const fs = require('fs');
const getConfig = require('./config');
const logger = require('./logger');
const utils = require('./utils');
const initApp = require('./tasks/initApp');
const copyExample = require('./tasks/copyExample');
const setupScreens = require('./tasks/setupScreens');
const buildAndRun = require('./tasks/buildApp');

const config = getConfig();

console.log('⚙️  Script started with configuration:');
console.table({
  'rn-version': config['rn-version'],
  'screens-version': config['screens-version'],
  'screens-ref-type': config['screens-ref-type'],
  'screens-ref-target': config['screens-ref-target'],
  variant: config.variant,
  platform: config.platform,
  'app-name': config['app-name'],
  'from-origin': config['from-origin'],
  template: config.template,
  run: config.run,
  'ios-simulator': config['ios-simulator'] ?? '',
  'ios-device': config['ios-device'] ?? '',
  'ios-udid': config['ios-udid'] ?? '',
  'android-device': config['android-device'] ?? '',
});
console.log('--------------------------------------------------');

fs.mkdirSync(config.paths.releaseTests, { recursive: true });
logger.initLog(config.paths.log);

console.time('⏳ Total execution time');

initApp(config, utils);
copyExample(config, utils);
setupScreens(config, utils);
if (config.run) {
  buildAndRun(config, utils);
}

console.log(`🎉 All steps completed successfully!\n`);
console.timeEnd('⏳ Total execution time');
