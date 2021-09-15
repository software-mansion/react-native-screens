/* eslint-disable import/no-commonjs */

const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pack = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = [
  '@react-navigation/native',
  'react-navigation',
  'react-navigation-stack',
  'react-native-safe-area-context',
  ...Object.keys(pack.peerDependencies),
];

// We need to make sure that only one version is loaded for peerDependencies
// So we blacklist them at the root, and alias them to the versions in example's node_modules
const modulesToExclude = modules.map(
  (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
);

module.exports = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    blockList: exclusionList([
      ...modulesToExclude,
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
      /.*\.ProjectImports\.zip/,
    ]),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
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
