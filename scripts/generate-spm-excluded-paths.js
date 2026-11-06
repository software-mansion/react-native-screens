/*
 * Writes the `excludedPaths` list in `Package.swift`.
 *
 * SwiftPM collects a target's files by walking its whole `path` (`.` here),
 * skipping only dot-prefixed names and exact `exclude` entries; `sources`
 * filters the result afterwards. In a `link:`-ed checkout that walk covers
 * `node_modules`, the example apps and the symlinks leading back to this
 * directory, which turns package resolution from seconds into tens of
 * minutes. The list names every top-level entry that is not a source root.
 *
 * Usage: `node scripts/generate-spm-excluded-paths.js [--check]`. With
 * `--check`, nothing is written; the script exits 1 if `Package.swift` is out
 * of date.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGE_SWIFT = path.join(ROOT, 'Package.swift');
const SOURCE_ROOTS = ['ios', 'common', 'cpp'];
// Git-ignored, so they may be absent when the list is generated.
const ALWAYS_EXCLUDED_DIRS = ['lib', 'node_modules'];
const FIXED_EXCLUDED_PATHS = ['ios/RNScreens.xcodeproj'];
const LIST_PATTERN = /(let excludedPaths: \[String\] = \[\n)([\s\S]*?)(\n\])/;

function computeExcludedPaths() {
  const topLevelDirs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter(
      entry =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        !SOURCE_ROOTS.includes(entry.name),
    )
    .map(entry => entry.name);
  return [
    ...new Set([
      ...topLevelDirs,
      ...ALWAYS_EXCLUDED_DIRS,
      ...FIXED_EXCLUDED_PATHS,
    ]),
  ].sort();
}

function readPackageSwift() {
  const contents = fs.readFileSync(PACKAGE_SWIFT, 'utf8');
  const match = contents.match(LIST_PATTERN);
  if (!match) {
    throw new Error('`excludedPaths` list not found in Package.swift');
  }
  return {
    contents,
    entries: [...match[2].matchAll(/"([^"]+)"/g)].map(m => m[1]),
  };
}

/** Returns a description of each difference; empty when up to date. */
function checkExcludedPaths() {
  const expected = computeExcludedPaths();
  const { entries } = readPackageSwift();
  const missing = expected.filter(entry => !entries.includes(entry));
  const extra = entries.filter(entry => !expected.includes(entry));
  return [
    ...missing.map(entry => `Package.swift: missing excluded path "${entry}"`),
    ...extra.map(entry => `Package.swift: stale excluded path "${entry}"`),
    ...(missing.length === 0 &&
    extra.length === 0 &&
    expected.join() !== entries.join()
      ? ['Package.swift: excluded paths are not in generated order']
      : []),
  ];
}

function writeExcludedPaths() {
  const { contents } = readPackageSwift();
  const list = computeExcludedPaths()
    .map(entry => `    "${entry}",`)
    .join('\n');
  fs.writeFileSync(
    PACKAGE_SWIFT,
    contents.replace(LIST_PATTERN, (_, open, __, close) => open + list + close),
  );
}

module.exports = { checkExcludedPaths };

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const problems = checkExcludedPaths();
    if (problems.length > 0) {
      console.error(problems.join('\n'));
      console.error(
        '\nRun `yarn generate-spm-excluded-paths` to update Package.swift.',
      );
      process.exit(1);
    }
  } else {
    writeExcludedPaths();
  }
}
