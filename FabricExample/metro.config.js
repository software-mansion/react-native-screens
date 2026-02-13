/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const fs = require('fs');
const path = require('path');
const escape = require('escape-string-regexp');

// Inlined from metro-config defaults (package exports don't expose the path)
function exclusionList(additionalExclusions) {
  const list = [/\/__tests__\/.*/];
  const patterns = (additionalExclusions || []).concat(list);
  const escaped = patterns.map(p =>
    p instanceof RegExp ? p.source.replace(/\/|\\\//g, '\\' + path.sep) : escape(String(p))
  );
  return new RegExp('(' + escaped.join('|') + ')$');
}

const libPackage = require('../package.json');
const appPackage = require('./package.json');

/**
 * @param {string} module
 * @returns {boolean} `true` **should** be returned for any module that is duplicated
 * in `react-navigation` submodule & causes runtime issues.
 */
function reactNavigationOptionalModuleFilter(module) {
  return module in appPackage.dependencies === true ||
    module in libPackage.devDependencies === true ||
    module in libPackage.dependencies === true;
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

// These should be imported from application node_modules rather than lib.
const modules = [
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  ...Object.keys(libPackage.peerDependencies),
];


// Currently each `@react-navigation` package has `src/index.tsx`.
const reactNavigationIndexExts = ['tsx', 'ts', 'js', 'jsx'];

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

const appNodeModules = path.join(appDir, 'node_modules');
const libNodeModules = path.join(libRootDir, 'node_modules');
const reactNavigationNodeModules = path.join(reactNavigationDir, 'node_modules');

const config = {
  projectRoot: appDir,
  watchFolders: [libRootDir],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we exclude them at the root, and alias them to the versions in example's node_modules
  resolver: {
    resolverMainFields: ['react-native', 'browser', 'main'],

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
    // 1. blocks all conflicting modules by using `blockList` (this includes both our lib & react navigation),
    // 2. disables module resolution algorithm - we do not look for different node_modules beside those specified explicitely,
    // 3. looks only inside these node modules directories which are explicitly specified in `nodeModulesPaths`,
    // 4. hijacks requests for `react-navigation` packages & resolves them to the `@react-navigation/xxx/src/*` files
    // so that they are transformed & included in bundle. Otherwise the pretransformed files are included causing
    // quality-of-life degradation, since local changes to source code are not immediately visible.

    disableHierarchicalLookup: true,

    // Project node modules + directory where `react-native-screens` repo lives in + react navigation node modules.
    // These are consulted in order of definition.
    // TODO: make it so this does not depend on whether the user renamed the repo or not...
    nodeModulesPaths: [appNodeModules, path.join(appDir, '../../'), libNodeModules, reactNavigationNodeModules],

    resolveRequest: (context, moduleName, platform) => {
      // We want to enforce that in case of react navigation the `src` files
      // are transformed & bundled instead of the pretransformed ones in `@react-navigation/xxx/lib` directory.
      if (moduleName.startsWith('@react-navigation/')) {
        for (const fileExt of reactNavigationIndexExts) {
          // App node modules contain symlink to react-navigation submodule.
          const moduleEntryPoint = path.join(appNodeModules, moduleName, 'src', `index.${fileExt}`);
          if (fs.existsSync(moduleEntryPoint)) {
            return {
              filePath: moduleEntryPoint,
              type: 'sourceFile',
            };
          }
        }

        console.warn(`
          Failed to find entry point of module: ${moduleName}.
          Please note that this **might** mean that local changes to that module code won't be visible in bundle.
        `);
      }

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

