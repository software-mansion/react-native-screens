const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pack = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = [
  '@react-navigation/native',
  // '@react-navigation/bottom-tabs',
  // '@react-navigation/stack',
  // '@react-navigation/core',
  // '@react-navigation/elements',
  // '@react-navigation/routers',
  // '@react-navigation/native-stack',
  'react-native-reanimated',
  'react-native-safe-area-context',
  ...Object.keys(pack.peerDependencies),
];

const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we exclude them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: exclusionList(
      modules.map(
        m => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
      ),
    ),

    // maxWorkers: 1,

    extraNodeModules: modules.reduce((acc, name) => {
      const enm = path.join(__dirname, 'node_modules', name);
      const npm = path.join(__dirname, '../../');
      console.log(`ENM: ${enm} NMP: ${npm}`);
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),

    nodeModulesPaths: [path.join(__dirname, '../../')],

    maxWorkers: 1,

    resolveRequest: (context, moduleName, platform) => {
      // console.log(
      //   `context: ${JSON.stringify(
      //     context,
      //   )} moduleName: ${moduleName} platform ${platform}`,
      // );
      if (moduleName === 'react') {
        // Logic to resolve the module name to a file path...
        // NOTE: Throw an error if there is no resolution.
        return {
          filePath: '/Users/kkafara/workspace/swm/react-native-screens/TestsExample/node_modules/react/index.js',
          type: 'sourceFile',
        };
      }
      if (moduleName === 'react-native') {
        // Logic to resolve the module name to a file path...
        // NOTE: Throw an error if there is no resolution.
        return {
          filePath: '/Users/kkafara/workspace/swm/react-native-screens/TestsExample/node_modules/react-native/index.js',
          type: 'sourceFile',
        };
      }

      if (moduleName === 'react-native-safe-area-context') {
        return {
          filePath: '/Users/kkafara/workspace/swm/react-native-screens/TestsExample/node_modules/react-native-safe-area-context/src/index.tsx',
          type: 'sourceFile',
        };
      }

      if (moduleName === 'react-native-screens') {
        return {
          filePath: '/Users/kkafara/workspace/swm/react-native-screens/src/index.tsx',
          type: 'sourceFile',
        };
      }
      // Optionally, chain to the standard Metro resolver.
      return context.resolveRequest(context, moduleName, platform);
    },
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
