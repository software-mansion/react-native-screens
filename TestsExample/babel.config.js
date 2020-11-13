module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      'module-resolver',
      {
        alias: {
          'react-native-screens': '../src',
          'react': './node_modules/react',
          'react-native': './node_modules/react-native',
          '@babel': './node_modules/@babel',
          '@react-navigation/native': './node_modules/@react-navigation/native/src',
        },
      },
    ],
  ]
};
