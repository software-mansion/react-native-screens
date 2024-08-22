const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pack = require('../package.json');

const projectPack = require('./package.json');
const resolvedExts = ['.ts', '.tsx', '.js', '.jsx'];

const root = path.resolve(__dirname, '..');
const projectNodeModules = path.join(__dirname, 'node_modules');

const fs = require('fs');
const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

const modules = [...Object.keys(pack.peerDependencies), 'react-native-windows'];

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
      // This stops "react-native run-windows" from causing the metro server to
      // crash if its already running
      new RegExp(
        `${path.join(__dirname, 'windows').replace(/[/\\]+/g, '/')}.*`,
      ),
      new RegExp(`${path.join(__dirname, 'macos').replace(/[/\\]+/g, '/')}.*`),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ),
    nodeModulesPaths: [projectNodeModules, path.join(__dirname, '../../')],
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),

    // Since we use react-navigation as submodule it comes with it's own node_modules. While loading
    // react-navigation code, due to how module resolution algorithms works it seems that its node_modules
    // are consulted first, resulting in double-loaded packages (so doubled react, react-native and other package instances) leading
    // to various errors. To mitigate this we define below custom request resolver, hijacking requests to conflicting modules and manually
    // resolving appropriate files. **Most likely** this can be achieved by proper usage of blockList but I found this method working ¯\_(ツ)_/¯
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-screens') {
        return {
          filePath: path.join(root, 'src', 'index.tsx'),
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
      },
    }),
    // This fixes the 'missing-asset-registry-path` error (see https://github.com/microsoft/react-native-windows/issues/11437)
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
