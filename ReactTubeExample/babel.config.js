module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-syntax-import-assertions",
    "@babel/plugin-proposal-private-methods",
    [
      "module-resolver",
      {
        alias: {
          stream: "stream-browserify",
          buffer: "@craftzdog/react-native-buffer",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
