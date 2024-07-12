module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.tsx', '*.js'],
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
