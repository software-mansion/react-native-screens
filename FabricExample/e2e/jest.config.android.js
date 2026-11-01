const baseConfig = require('./jest.config');

// iOS-only spec files would only load to skip every test.
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...baseConfig,
  // The slowest Android test takes ~52 s on CI. iOS keeps the base 120 s: its
  // slowest takes ~85 s.
  testTimeout: 90000,
  testPathIgnorePatterns: [
    ...baseConfig.testPathIgnorePatterns,
    '-ios\\.e2e\\.ts$',
  ],
};
