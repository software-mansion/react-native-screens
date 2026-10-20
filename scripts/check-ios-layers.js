/*
 * Enforces the layer boundary of RFC-1823 on iOS:
 *
 * 1. Header basenames are unique under `ios/` (CocoaPods flattens headers and
 *    SPM resolves bare names through a flat list of search paths).
 * 2. `ios/core` does not include React Native headers (including the folly and
 *    yoga libraries it ships) or use `RCT*` symbols.
 *    Symbols are matched anywhere in a file, comments included, because
 *    `RCT*` macros also arrive through transitive imports.
 * 3. Every quoted import in `ios/core` resolves to a file under `ios/core`
 *    (so `core` imports neither `react` nor `legacy`). Angle-bracket imports
 *    of our own headers (`<RNSFoo.h>`, `<RNScreens/RNSFoo.h>`) are held to the
 *    same rule.
 * 4. `ios/core` headers are plain Objective-C: no C++, not even guarded. C++
 *    standard headers are recognised by their missing extension (`<string>`).
 * 5. The `headerSearchPaths` list in `Package.swift` is up to date.
 * 6. `ios/core` headers name no component-view class (RFC rule 6): a `core`
 *    signature takes a protocol describing what the view provides.
 *
 * The check fails when no core sources are found, so it cannot pass
 * vacuously.
 *
 * Passing files or directories (`yarn check-ios-layers ios/tabs/host ...`)
 * also checks them as if they were already in `ios/core`, so a component can
 * be verified before its move PR (phase-3 recipe, step c). They may import
 * each other.
 */

const fs = require('fs');
const path = require('path');
const { checkHeaderSearchPaths } = require('./generate-spm-header-paths');

const ROOT = path.join(__dirname, '..');
const IOS_DIR = path.join(ROOT, 'ios');
const CORE_DIR = path.join(IOS_DIR, 'core');

const REACT_NATIVE_INCLUDE =
  /#\s*(?:import|include)\s*<(?:React|react|ReactCommon|jsi|folly|yoga)\/|@import\s+React\b/;
const RCT_SYMBOL = /\bRCT[A-Z]\w*/;
const QUOTED_INCLUDE = /#\s*(?:import|include)\s*"([^"]+)"/;
const ANGLE_INCLUDE = /#\s*(?:import|include)\s*<([^>]+)>/;
const COMPONENT_VIEW = /\b\w+ComponentView\b/;
const CPP_IN_HEADER =
  /__cplusplus|#\s*(?:import|include)\s*<[\w/]+>|\bnamespace\b|\btemplate\s*<|std::|folly|react::/;

function listFiles(dir, pattern) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(entryPath, pattern);
    }
    return pattern.test(entry.name) ? [entryPath] : [];
  });
}

const relative = file => path.relative(process.cwd(), file);
const isUnder = (file, dir) => !path.relative(dir, file).startsWith('..');

const headers = listFiles(IOS_DIR, /\.h$/);
const coreFiles = listFiles(CORE_DIR, /\.(h|m|mm|cpp)$/);
const candidateFiles = process.argv.slice(2).flatMap(arg => {
  const target = path.resolve(arg);
  return fs.statSync(target).isDirectory()
    ? listFiles(target, /\.(h|m|mm|cpp)$/)
    : [target];
});
const isAllowedTarget = target =>
  isUnder(target, CORE_DIR) || candidateFiles.includes(target);

if (coreFiles.length === 0) {
  console.error(
    `No core sources found under ${relative(
      CORE_DIR,
    )}; the layer check would pass vacuously.`,
  );
  process.exit(1);
}

const headersByBasename = new Map();
headers.forEach(header => {
  const basename = path.basename(header);
  headersByBasename.set(basename, [
    ...(headersByBasename.get(basename) ?? []),
    header,
  ]);
});

const duplicateBasenames = [...headersByBasename.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(
    ([basename, paths]) =>
      `duplicate header basename ${basename}: ${paths
        .map(relative)
        .join(', ')}`,
  );

function checkLine(file, line) {
  const reasons = [];
  if (REACT_NATIVE_INCLUDE.test(line)) {
    reasons.push('core must not include React Native headers');
  }
  if (RCT_SYMBOL.test(line)) {
    reasons.push('core must not use React Native (`RCT*`) symbols');
  }
  const quoted = line.match(QUOTED_INCLUDE);
  if (quoted) {
    const targets = headersByBasename.get(path.basename(quoted[1])) ?? [];
    if (targets.length === 0) {
      reasons.push(`"${quoted[1]}" resolves to no header under ios/`);
    } else if (!targets.some(isAllowedTarget)) {
      reasons.push(
        `core must not import ${relative(targets[0])} (outside ios/core)`,
      );
    }
  }
  // `<RNSFoo.h>` and `<RNScreens/RNSFoo.h>` name our own headers; anything
  // else in angle brackets is a system or third-party header.
  const angled = line.match(ANGLE_INCLUDE);
  if (angled && /^(?:RNScreens\/)?[^/]+$/.test(angled[1])) {
    const targets = headersByBasename.get(path.basename(angled[1])) ?? [];
    if (targets.length > 0 && !targets.some(isAllowedTarget)) {
      reasons.push(
        `core must not import ${relative(targets[0])} (outside ios/core)`,
      );
    }
  }
  if (file.endsWith('.h') && CPP_IN_HEADER.test(line)) {
    reasons.push('core headers must be plain Objective-C (no C++)');
  }
  if (file.endsWith('.h') && COMPONENT_VIEW.test(line)) {
    reasons.push('core headers must not name a component-view class');
  }
  return reasons;
}

const coreViolations = [...new Set([...coreFiles, ...candidateFiles])].flatMap(
  file =>
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .flatMap((line, index) =>
        checkLine(file, line).map(
          reason => `${relative(file)}:${index + 1}: ${reason}: ${line.trim()}`,
        ),
      ),
);

const violations = [
  ...duplicateBasenames,
  ...coreViolations,
  ...checkHeaderSearchPaths(),
];

if (violations.length > 0) {
  console.error(violations.join('\n'));
  console.error(
    `\n${violations.length} layer violation(s). See RFC-1823: \`ios/core\` must not depend on React Native, \`react\` or \`legacy\`; its headers must be plain Objective-C; header basenames must be unique under \`ios/\`; \`Package.swift\` must list every header directory (\`yarn generate-spm-header-paths\`).`,
  );
  process.exit(1);
}
