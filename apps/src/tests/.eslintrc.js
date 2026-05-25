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
