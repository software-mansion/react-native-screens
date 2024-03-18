/* eslint-disable import/no-commonjs */

const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pack = require('../package.json');

// react-native-screens root directory
const rnsRoot = path.resolve(__dirname, '..');

const modules = [
  '@react-navigation/native',
  'react-native-reanimated',
  'react-native-safe-area-context',
  ...Object.keys(pack.peerDependencies),
];

module.exports = {
  projectRoot: __dirname,
  watchFolders: [rnsRoot],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blacklist them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: blacklist(
      modules.map(
        m => new RegExp(`^${escape(path.join(rnsRoot, 'node_modules', m))}\\/.*$`),
      ),
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),

    // Since we use react-naviation as submodule it comes with it's own node_modules. While loading
    // react-navigation code, due to how module resolution algorithms works it seems that its node_modules
    // are consulted first, resulting in double-loaded packages (so doubled react, react-native and other package instances) leading
    // to various errors. To mitigate this we define below custom request resolver, hijacking requests to conflicting modules and manually
    // resolving appropriate files. **Most likely** this can be achieved by proper usage of blockList but I found this method working ¯\_(ツ)_/¯
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react' || moduleName === 'react-native') {
        return {
          filePath: path.join(
            __dirname,
            'node_modules',
            moduleName,
            'index.js',
          ),
          type: 'sourceFile',
        };
      }

      if (moduleName === 'react-native-safe-area-context') {
        return {
          filePath: path.join(
            __dirname,
            'node_modules',
            moduleName,
            'src',
            'index.tsx',
          ),
          type: 'sourceFile',
        };
      }

      if (moduleName === 'react-native-screens') {
        return {
          filePath: path.join(rnsRoot, 'src', 'index.tsx'),
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
