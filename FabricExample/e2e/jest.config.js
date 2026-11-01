/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.e2e.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: '<rootDir>/e2e/skip-after-failure-environment.js',
  verbose: true,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/e2e/jest.setup.ts'],
  moduleNameMapper: {
    '^@e2e/(.*)$': '<rootDir>/e2e/helpers/$1',
  },
};
