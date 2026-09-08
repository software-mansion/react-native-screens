module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@apps': '../apps/src',
          '@assets': '../apps/assets',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
