const path = require('path');
const Module = require('module');

const pluginPath = require.resolve(
  path.join(__dirname, 'eslint-plugin-local-rules'),
);
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request === 'eslint-plugin-local-rules') {
    return pluginPath;
  }
  return originalResolve.call(this, request, ...args);
};

module.exports = {
  overrides: [
    {
      files: [
        'single-feature-tests/**/*.tsx',
        'single-feature-tests/**/*.ts',
        'component-integration-tests/**/*.tsx',
        'component-integration-tests/**/*.ts',
      ],
      plugins: ['local-rules'],
      rules: {
        'local-rules/require-top-level-exports': 'error',
      },
    },
  ],
};
