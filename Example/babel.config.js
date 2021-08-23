module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-screens': '../src',
        },
      },
    ],
  ],
};
