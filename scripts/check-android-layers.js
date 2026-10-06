/*
 * Enforces the layer boundary of RFC-1823 on Android: code under the
 * `com.swmansion.rnscreens.core` package must not depend on React Native
 * (or a Meta library it ships, e.g. Fresco), on the `react` layer, on
 * `legacy`, or on any other package of ours outside `core`.
 *
 * References are matched anywhere in a file, not only in import lines,
 * so fully qualified usages are caught as well. The check fails when no
 * core sources are found, so it cannot pass vacuously.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'android', 'src');
const CORE_PACKAGE_PATH = path.join(
  'java',
  'com',
  'swmansion',
  'rnscreens',
  'core',
);

const FORBIDDEN = [
  {
    pattern: /\bcom\.facebook\./,
    reason: 'React Native or a Meta library it ships (e.g. Fresco)',
  },
  {
    pattern: /\bcom\.swmansion\.rnscreens\.react\b/,
    reason: 'the `react` layer',
  },
  { pattern: /\bcom\.swmansion\.rnscreens\.legacy\b/, reason: '`legacy`' },
  {
    pattern: /\bcom\.swmansion\.rnscreens\.(?!core\b|react\b|legacy\b)/,
    reason: 'code outside `core`',
  },
];

// Not in `core` yet; RFC-1823 task A4b moves them and empties this list.
const ALLOWED_OUTSIDE_CORE = [
  'com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter',
  'com.swmansion.rnscreens.utils.dpToPx',
].map(name => new RegExp(`\\b${name.replace(/\./g, '\\.')}\\b`, 'g'));

function listSourceFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }
    return /\.(kt|java)$/.test(entry.name) ? [entryPath] : [];
  });
}

const coreFiles = fs
  .readdirSync(SRC_DIR, { withFileTypes: true })
  .filter(sourceSet => sourceSet.isDirectory())
  .flatMap(sourceSet =>
    listSourceFiles(path.join(SRC_DIR, sourceSet.name, CORE_PACKAGE_PATH)),
  );

if (coreFiles.length === 0) {
  console.error(
    `No core sources found under ${path.join(
      path.relative(process.cwd(), SRC_DIR),
      '*',
      CORE_PACKAGE_PATH,
    )}; the layer check would pass vacuously.`,
  );
  process.exit(1);
}

const violations = coreFiles.flatMap(file =>
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) => {
      const checked = ALLOWED_OUTSIDE_CORE.reduce(
        (rest, allowed) => rest.replace(allowed, ''),
        line,
      );
      return FORBIDDEN.filter(({ pattern }) => pattern.test(checked)).map(
        ({ reason }) =>
          `${path.relative(process.cwd(), file)}:${
            index + 1
          }: core must not depend on ${reason}: ${line.trim()}`,
      );
    }),
);

if (violations.length > 0) {
  console.error(violations.join('\n'));
  console.error(
    `\n${violations.length} layer violation(s). See RFC-1823: \`core\` must not depend on React Native (\`com.facebook.*\`), \`react\`, \`legacy\` or any other \`com.swmansion.rnscreens\` package outside \`core\`.`,
  );
  process.exit(1);
}
