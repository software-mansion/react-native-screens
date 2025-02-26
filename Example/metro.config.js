/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');

const libPackage = require('../package.json');
const appPackage = require('./package.json');

/**
 * @param {string} module
 */
function reactNavigationOptionalModuleFilter(module) {
  return module in appPackage.dependencies === false &&
    module in libPackage.devDependencies === false &&
    module in libPackage.dependencies === false;
}

/**
 * @param {Array<string>} modules
 * @param {string} nodeModulesParentDir
 */
function blockListProvider(modules, nodeModulesDir) {
  return modules.map(
    m =>
      new RegExp(`^${escape(path.join(nodeModulesDir, m))}\\/.*$`),
  );
}

// react-native-screens root directory
const libRootDir = path.resolve(__dirname, '..');
const reactNavigationDir = path.join(libRootDir, 'react-navigation');

// Application main directory
const appDir = __dirname;

const modules = [
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  ...Object.keys(libPackage.peerDependencies),
];

// We want to enforce that these modules are **not** imported from node modules
// of the react navigation git submodule.
const reactNavigationDuplicatedModules = [
  'react',
  'react-native',
  'react-native-screens',
  'react-dom', // TODO: Consider whether this won't conflict, especially that RN 78 uses React 19 & react-navigation still uses React 18.
].concat([
  'react-native-safe-area-context',
  'react-native-gesture-handler',
].filter(reactNavigationOptionalModuleFilter));

const resolvedExts = ['.ts', '.tsx', '.js', '.jsx'];

const appNodeModules = path.join(appDir, 'node_modules');
const libNodeModules = path.join(libRootDir, 'node_modules');
const reactNavigationNodeModules = path.join(reactNavigationDir, 'node_modules');

const config = {
  projectRoot: appDir,
  watchFolders: [libRootDir],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we exclude them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blockList: exclusionList(blockListProvider(modules, libNodeModules).concat(blockListProvider(reactNavigationDuplicatedModules, reactNavigationNodeModules))),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),

    // Since we use react-navigation as submodule it comes with it's own node_modules. While loading
    // react-navigation code, due to how module resolution algorithms works it seems that its node_modules
    // are consulted first, resulting in double-loaded packages (so doubled react, react-native and other package instances) leading
    // to various errors. To mitigate this we define this custom request resolver. It does following:
    //
    // 1. blocks all conflicting modules by using `blockList` (this includes both our lib & react navigation)
    // 2. disables module resolution algorithm - we do not look for node_modules besides those specified explicitely,
    // 3. looks only inside these node modules directories which are explicitly specified in `nodeModulesPaths`.

    disableHierarchicalLookup: true,

    // Project node modules + directory where `react-native-screens` repo lives in + react navigation node modules.
    // These are consulted in order of definition.
    // TODO: make it so this does not depend on whether the user renamed the repo or not...
    nodeModulesPaths: [appNodeModules, path.join(appDir, '../../'), libNodeModules, reactNavigationNodeModules],


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
