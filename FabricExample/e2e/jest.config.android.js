const baseConfig = require('./jest.config');

// iOS-only spec files would only load to skip every test.
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: [
    ...baseConfig.testPathIgnorePatterns,
    '-ios\\.e2e\\.ts$',
  ],
};
