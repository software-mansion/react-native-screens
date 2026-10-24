const baseConfig = require('./jest.config');

// Android-only spec files would only load to skip every test.
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: ['/node_modules/', '-android\\.e2e\\.ts$'],
};
