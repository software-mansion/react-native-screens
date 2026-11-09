/*
 * Writes the `excludedPaths` list in `Package.swift`.
 *
 * SwiftPM collects a target's files by walking its whole `path` (`.` here),
 * skipping only dot-prefixed names and exact `exclude` entries; `sources`
 * filters the result afterwards. In a `link:`-ed checkout that walk covers
 * `node_modules`, the example apps and the symlinks leading back to this
 * directory, which turns package resolution from seconds into tens of
 * minutes. The list names every tracked top-level directory that is not a
 * source root, plus the git-ignored directories that tooling creates in the
 * repository root. It is derived from the git index rather than from the
 * filesystem, so local build artifacts do not change the committed list and a
 * staged directory shows up before it is committed.
 *
 * Usage: `node scripts/generate-spm-excluded-paths.js [--check]`. With
 * `--check`, nothing is written; the script exits 1 if `Package.swift` is out
 * of date.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PACKAGE_SWIFT = path.join(ROOT, 'Package.swift');
const SOURCE_ROOTS = ['ios', 'common', 'cpp'];
// Git-ignored directories created in the repository root by Yarn, Xcode and
// the release playground (`scripts/release_tests`); excluded whether or not
// they exist on the machine generating the list.
const ALWAYS_EXCLUDED_DIRS = [
  'DerivedData',
  'build',
  'lib',
  'node_modules',
  'release_tests',
];
const FIXED_EXCLUDED_PATHS = ['ios/RNScreens.xcodeproj'];
const LIST_PATTERN = /(let excludedPaths: \[String\] = \[\n)([\s\S]*?)(\n\])/;

function gitLines(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

/** Top-level directories of the index, i.e. of the commit being prepared. */
function listTrackedTopLevelDirs() {
  const dirs = gitLines(['ls-files'])
    .filter(file => file.includes('/'))
    .map(file => file.split('/')[0]);
  // A submodule is a single index entry without a slash; `.gitmodules` names them.
  const submodules = gitLines([
    'config',
    '-f',
    '.gitmodules',
    '--get-regexp',
    '^submodule\\..*\\.path$',
  ]).map(line => line.split(' ')[1]);
  return [...new Set([...dirs, ...submodules])];
}

function computeExcludedPaths() {
  const topLevelDirs = listTrackedTopLevelDirs().filter(
    name => !name.startsWith('.') && !SOURCE_ROOTS.includes(name),
  );
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
