import { defineConfig, mergeConfig, transformWithEsbuild } from 'vite';

import config from 'react-native-builder-bob/vite-config';
import appPack from './package.json' with { type: 'json' };
import pack from '../package.json' with { type: 'json' };

// The code is in `../apps`, so dependencies can't be found there
// So we alias them to resolve to the ones in this package's node_modules
const dependencyAliases = Object.keys(appPack.dependencies)
  .filter(name => name !== 'react-native' && name !== pack.name)
  .map(name => [name, new URL(`./node_modules/${name}`, import.meta.url)]);

function appsJsAsJsx() {
  return {
    name: 'apps-js-as-jsx',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.js') && /\/apps\//.test(id)) {
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      }

      return null;
    },
  };
}

export default defineConfig(env =>
  mergeConfig(config(env), {
    plugins: [appsJsAsJsx()],
    resolve: {
      alias: {
        ...Object.fromEntries(dependencyAliases),
        [pack.name]: new URL('..', import.meta.url),
        '@apps': new URL('../apps/src', import.meta.url),
        '@assets': new URL('../apps/assets', import.meta.url),
      },
      dedupe: Object.keys(pack.peerDependencies),
    },
  }),
);
