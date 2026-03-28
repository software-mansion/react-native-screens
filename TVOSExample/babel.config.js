module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        alias: {
          '@apps': '../apps/src',
          '@assets': '../apps/assets',
        },
      },
    ],
  ],
};
