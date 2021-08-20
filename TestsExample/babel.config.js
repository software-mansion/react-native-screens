module.exports = {
  presets: ['babel-preset-expo', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'react-native-screens': '../src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
