const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');

const pack = require('../package.json');
const projectPack = require('./package.json');

// react-native-screens root directory
const rnsRoot = path.resolve(__dirname, '..');

const modules = [
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  ...Object.keys(pack.peerDependencies),
];

const resolvedExts = ['.ts', '.tsx', '.js', '.jsx'];

const projectNodeModules = path.join(__dirname, 'node_modules');

const config = {
  projectRoot: __dirname,
  watchFolders: [rnsRoot],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we exclude them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: exclusionList(
      modules.map(
        m =>
          new RegExp(`^${escape(path.join(rnsRoot, 'node_modules', m))}\\/.*$`),
      ),
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),

    nodeModulesPaths: [projectNodeModules, path.join(__dirname, '../../')],

    // Since we use react-navigation as submodule it comes with it's own node_modules. While loading
    // react-navigation code, due to how module resolution algorithms works it seems that its node_modules
    // are consulted first, resulting in double-loaded packages (so doubled react, react-native and other package instances) leading
    // to various errors. To mitigate this we define below custom request resolver, hijacking requests to conflicting modules and manually
    // resolving appropriate files. **Most likely** this can be achieved by proper usage of blockList but I found this method working ¯\_(ツ)_/¯
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-screens') {
        return {
          filePath: path.join(rnsRoot, 'src', 'index.tsx'),
          type: 'sourceFile',
        };
      }

      if (moduleName in projectPack.dependencies) {
        for (const ext of resolvedExts) {
          const possiblePath = path.join(
            __dirname,
            'node_modules',
            moduleName,
            `index${ext}`,
          );

          const possibleSrcPath = path.join(
            __dirname,
            'node_modules',
            moduleName,
            'src',
            `index${ext}`,
          );

          if (fs.existsSync(possiblePath)) {
            return {
              filePath: possiblePath,
              type: 'sourceFile',
            };
          } else if (fs.existsSync(possibleSrcPath)) {
            return {
              filePath: possibleSrcPath,
              type: 'sourceFile',
            };
          }
        }
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
