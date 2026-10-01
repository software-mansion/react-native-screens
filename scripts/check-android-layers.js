/*
 * Enforces the layer boundary of RFC-1823 on Android: code under the
 * `com.swmansion.rnscreens.core` package must not depend on React Native,
 * on the `react` layer, or on `legacy`.
 *
 * References are matched anywhere in a file, not only in import lines,
 * so fully qualified usages are caught as well.
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
  { pattern: /\bcom\.facebook\.react\b/, reason: 'React Native' },
  {
    pattern: /\bcom\.swmansion\.rnscreens\.react\b/,
    reason: 'the `react` layer',
  },
  { pattern: /\bcom\.swmansion\.rnscreens\.legacy\b/, reason: '`legacy`' },
];

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

const violations = coreFiles.flatMap(file =>
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) =>
      FORBIDDEN.filter(({ pattern }) => pattern.test(line)).map(
        ({ reason }) =>
          `${path.relative(process.cwd(), file)}:${
            index + 1
          }: core must not depend on ${reason}: ${line.trim()}`,
      ),
    ),
);

if (violations.length > 0) {
  console.error(violations.join('\n'));
  console.error(
    `\n${violations.length} layer violation(s). See RFC-1823: \`core\` must not depend on \`react\`, React Native or \`legacy\`.`,
  );
  process.exit(1);
}
