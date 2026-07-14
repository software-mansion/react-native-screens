#!/usr/bin/env node
//
// check-react-symbols-not-leaked-to-swift.js
//
// Guards the invariant established by the "hide react symbols from swift" fix:
// the public Objective-C headers of the `RNScreens` module must NOT expose any
// React (React-Core / Fabric / ReactCommon ...) symbols to Swift.
//
// Why this matters
// ----------------
// Swift consumes `RNScreens` through its Clang module. The Clang importer parses
// the public Objective-C headers in *Objective-C* mode (without `__cplusplus`).
// If a public header `#import`s a React header (or derives from a React type)
// outside of an `#if defined(__cplusplus)` guard, that React header is baked
// into the precompiled `RNScreens` Clang module (`.pcm`) and leaks into every
// Swift translation unit that does `import RNScreens`.
//
// How the check works
// -------------------
// After the app is built, Xcode emits a precompiled module for `RNScreens` under
// `.../SwiftExplicitPrecompiledModules/RNScreens-*.pcm`. We dump its inputs with
// `clang -module-file-info` and assert that every input header is either:
//   * a system / SDK header (UIKit, Foundation, the SDK itself), or
//   * one of the module's own public headers (incl. RNS-owned `RCT*` categories
//     such as `RCTConvert+RNSTabs.h`).
// Any input that lives outside the module's own header directory (e.g. a
// React-Core header like `RCTViewManager.h` or `RCTBridge.h`) is a leak and
// fails the check.
//
// Usage
// -----
//   node scripts/ios/check-react-symbols-not-leaked-to-swift.js [SEARCH_ROOT]
//
// SEARCH_ROOT defaults to ~/Library/Developer/Xcode/DerivedData. Pass a custom
// DerivedData path when the build uses one (e.g. `-derivedDataPath`).

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const MODULE_NAME = 'RNScreens';
const SEARCH_ROOT =
  process.argv[2] ||
  path.join(os.homedir(), 'Library', 'Developer', 'Xcode', 'DerivedData');

function fail(...lines) {
  console.error(lines.join('\n'));
  process.exit(1);
}

if (!isDirectory(SEARCH_ROOT)) {
  fail(
    `error: search root not found: ${SEARCH_ROOT}`,
    `       Build the app first so that the ${MODULE_NAME} Clang module is generated.`
  );
}

// Collect every precompiled module for RNScreens (there may be several, e.g. one
// per architecture / configuration). All of them must be clean.
const pcms = findPcms(SEARCH_ROOT).sort();

if (pcms.length === 0) {
  fail(
    `error: no ${MODULE_NAME}-*.pcm found under ${SEARCH_ROOT}.`,
    `       The Swift Clang module for ${MODULE_NAME} was not generated -`,
    `       make sure the iOS app was built (with Swift) before running this check.`
  );
}

let leakFound = false;

for (const pcm of pcms) {
  console.log(`==> Inspecting ${path.basename(pcm)}`);

  const inputs = readModuleInputs(pcm);

  if (inputs.length === 0) {
    fail(`error: could not read input files from ${pcm}`);
  }

  // The module's own public headers live alongside its module map.
  const moduleDir = resolveModuleDir(inputs);

  const leaks = inputs.filter((file) => !isAllowed(file, moduleDir));

  if (leaks.length > 0) {
    leakFound = true;
    console.error(
      `  ✗ React/foreign headers leaked into the ${MODULE_NAME} Swift module:`
    );
    for (const file of leaks) {
      console.error(`      - ${file}`);
    }
  } else {
    console.log('  ✓ no foreign headers leaked');
  }
}

if (leakFound) {
  fail(
    '',
    `React symbols are leaking into the ${MODULE_NAME} Swift module.`,
    '',
    'A public Objective-C header imports a React header (or derives from a React',
    "type) outside of an '#if defined(__cplusplus)' guard. Wrap the React import and",
    'the React-dependent declaration in such a guard so the symbol stays invisible to',
    "Swift's (Objective-C) Clang importer. See the headers under ios/ for the pattern."
  );
}

console.log(`All ${MODULE_NAME} Swift modules are free of leaked React symbols.`);

// ---------------------------------------------------------------------------

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// Recursively find every `RNScreens-*.pcm`. The precompiled module can land in
// different directories depending on the toolchain / build mode:
//   * `SwiftExplicitPrecompiledModules/` - Swift's explicit-module build
//   * `ExplicitPrecompiledModules/`       - Clang's explicit-module build
//                                           (what Xcode 26 emits from the CLI)
//   * `ModuleCache.noindex/`              - implicit module cache
// We accept all of them and let the caller decide which are relevant.
function findPcms(root) {
  const pcmName = new RegExp(`^${MODULE_NAME}-.*\\.pcm$`);
  const dirMatchers = [
    'SwiftExplicitPrecompiledModules',
    'ExplicitPrecompiledModules',
    'ModuleCache.noindex',
  ].map((name) => `${path.sep}${name}${path.sep}`);
  const results = [];

  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // unreadable directory - skip, mirroring `find`'s 2>/dev/null
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && pcmName.test(entry.name)) {
        if (dirMatchers.some((needle) => full.includes(needle))) {
          results.push(full);
        }
      }
    }
  };

  walk(root);
  // Dedupe (a path can only appear once from a single walk, but keep parity
  // with the original `sort -u`).
  return [...new Set(results)];
}

// Dump the precompiled module's inputs and return the list of header paths.
function readModuleInputs(pcm) {
  let output;
  try {
    output = execFileSync('xcrun', ['clang', '-module-file-info', pcm], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return [];
  }

  return output
    .split('\n')
    .map((line) => {
      const match = line.match(/^\s*Input file:\s*(.*)$/);
      if (!match) {
        return null;
      }
      // Strip a trailing " [System]" marker.
      return match[1].replace(/\s*\[System\]$/, '');
    })
    .filter((file) => file !== null && file.length > 0);
}

// The module map (or its umbrella header) sits in the module's own header dir.
function resolveModuleDir(inputs) {
  const moduleMap = inputs.find((file) =>
    new RegExp(`/${MODULE_NAME}\\.modulemap$`).test(file)
  );
  if (moduleMap) {
    return path.dirname(moduleMap);
  }
  const umbrella = inputs.find((file) =>
    new RegExp(`/${MODULE_NAME}-umbrella\\.h$`).test(file)
  );
  return umbrella ? path.dirname(umbrella) : '';
}

// Headers allowed to back the module:
//   * the module's own public headers (under the dir holding its module map), and
//   * system / SDK headers.
function isAllowed(file, moduleDir) {
  if (moduleDir && file.startsWith(`${moduleDir}/`)) {
    return true;
  }
  return (
    /\.platform\//.test(file) ||
    /\.sdk\//.test(file) ||
    /\/Applications\/Xcode[^/]*\.app\//.test(file)
  );
}
