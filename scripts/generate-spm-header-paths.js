/*
 * Writes the `headerSearchPaths` list in `Package.swift` (RFC-1823, D7).
 *
 * SPM has no header maps, so every directory under `ios/` that holds a header
 * must be listed for bare-name imports (`#import "RNSFoo.h"`) to resolve.
 * `common/cpp` and `cpp/legacy` are fixed include roots: their headers are
 * included by path (e.g. `<react/renderer/components/rnscreens/...>`).
 *
 * Usage: `node scripts/generate-spm-header-paths.js [--check]`. With
 * `--check`, nothing is written; the script exits 1 if `Package.swift` is out
 * of date.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGE_SWIFT = path.join(ROOT, 'Package.swift');
const FIXED_ROOTS = ['common/cpp', 'cpp/legacy'];
const LIST_PATTERN =
  /(let headerSearchPaths: \[String\] = \[\n)([\s\S]*?)(\n\])/;

function listHeaderDirs(dir) {
  const entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
  const hasHeader = entries.some(
    entry => entry.isFile() && entry.name.endsWith('.h'),
  );
  return [
    ...(hasHeader ? [dir] : []),
    ...entries
      .filter(entry => entry.isDirectory())
      .flatMap(entry => listHeaderDirs(`${dir}/${entry.name}`)),
  ];
}

function computeHeaderSearchPaths() {
  return [...listHeaderDirs('ios').sort(), ...FIXED_ROOTS];
}

function readPackageSwift() {
  const contents = fs.readFileSync(PACKAGE_SWIFT, 'utf8');
  const match = contents.match(LIST_PATTERN);
  if (!match) {
    throw new Error('`headerSearchPaths` list not found in Package.swift');
  }
  return {
    contents,
    entries: [...match[2].matchAll(/"([^"]+)"/g)].map(m => m[1]),
  };
}

/** Returns a description of each difference; empty when up to date. */
function checkHeaderSearchPaths() {
  const expected = computeHeaderSearchPaths();
  const { entries } = readPackageSwift();
  const missing = expected.filter(entry => !entries.includes(entry));
  const extra = entries.filter(entry => !expected.includes(entry));
  return [
    ...missing.map(
      entry => `Package.swift: missing header search path "${entry}"`,
    ),
    ...extra.map(entry => `Package.swift: stale header search path "${entry}"`),
    ...(missing.length === 0 &&
    extra.length === 0 &&
    expected.join() !== entries.join()
      ? ['Package.swift: header search paths are not in generated order']
      : []),
  ];
}

function writeHeaderSearchPaths() {
  const { contents } = readPackageSwift();
  const list = computeHeaderSearchPaths()
    .map(entry => `    "${entry}",`)
    .join('\n');
  fs.writeFileSync(
    PACKAGE_SWIFT,
    contents.replace(LIST_PATTERN, (_, open, __, close) => open + list + close),
  );
}

module.exports = { checkHeaderSearchPaths };

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const problems = checkHeaderSearchPaths();
    if (problems.length > 0) {
      console.error(problems.join('\n'));
      console.error(
        '\nRun `yarn generate-spm-header-paths` to update Package.swift.',
      );
      process.exit(1);
    }
  } else {
    writeHeaderSearchPaths();
  }
}
