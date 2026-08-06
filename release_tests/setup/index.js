const getConfig = require('./config');
const logger = require('./logger');
const utils = require('./utils');
const initApp = require('./tasks/initApp');
const copyExample = require('./tasks/copyExample');
const setupScreens = require('./tasks/setupScreens');
const buildApp = require('./tasks/buildApp');

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
  'force-fetch': config['force-fetch'],
  'example-app': config['example-app'],
  gamma: config.gamma,
});
console.log('--------------------------------------------------');

logger.initLog(config.paths.log);

console.time('⏳ Total execution time');

initApp(config, utils);
copyExample(config, utils);
setupScreens(config, utils);
buildApp(config, utils);

console.log(`🎉 All steps completed successfully!\n`);
console.timeEnd('⏳ Total execution time');
