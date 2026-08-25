#!/usr/bin/env node
//
// create-test-directory.cts
//
// Scaffolds a new test screen directory under apps/src/tests/<category>/<domain>/.
//
// Creates:
//   apps/src/tests/<category>/<domain>/<test-dir-name>/
//     index.tsx               (empty)
//     scenario-description.ts (from template, name/key filled in)
//     scenario.md             (copied from the repo scenario.md template)
//
// The <domain> directory is created automatically if it does not exist yet.
//
// Usage:
//   node scripts/create-test-directory.cts <test-dir-name> <screen-name> <domain> <category>
//
// Example:
//   node scripts/create-test-directory.cts \
//     test-form-sheet-grabber-visible \
//     "Grabber visible" \
//     form-sheet \
//     single-feature-tests

// Node's strip-only TypeScript support erases types without rewriting syntax, so
// this CommonJS script must use `require` rather than `import`/`import =`.
const fs = require('node:fs') as typeof import('node:fs');
const path = require('node:path') as typeof import('node:path');

const USAGE = `Usage: node scripts/create-test-directory.cts <test-dir-name> <screen-name> <domain> <category>

Arguments:
  test-dir-name   Directory name for the new test (e.g. test-form-sheet-grabber-visible).
                  Also used as the \`key\` in scenario-description.ts.
  screen-name     Human-readable screen name (e.g. "Grabber visible").
                  Used as the \`name\` in scenario-description.ts. Quote if it contains spaces.
  domain          Domain sub-directory (e.g. form-sheet). Created if missing.
  category        Category directory under apps/src/tests (e.g. single-feature-tests).

Example:
  node scripts/create-test-directory.cts test-form-sheet-grabber-visible "Grabber visible" form-sheet single-feature-tests`;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function scenarioDescriptionTemplate(
  screenName: string,
  testDirName: string,
): string {
  return `import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: '${screenName}',
  key: '${testDirName}',
  details: '',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
`;
}

function main(): void {
  const args = process.argv.slice(2);

  if (args[0] === '-h' || args[0] === '--help') {
    console.log(USAGE);
    return;
  }

  if (args.length !== 4) {
    fail(`Error: expected 4 arguments, got ${args.length}.\n\n${USAGE}`);
  }

  const [testDirName, screenName, domain, category] = args as [
    string,
    string,
    string,
    string,
  ];

  // Resolve paths relative to the repository root (this script lives in scripts/).
  const repoRoot = path.resolve(__dirname, '..');
  const testsRoot = path.join(repoRoot, 'apps', 'src', 'tests');
  const templateScenario = path.join(testsRoot, 'template', 'scenario.md');
  const categoryDir = path.join(testsRoot, category);
  const targetDir = path.join(categoryDir, domain, testDirName);

  if (!fs.existsSync(categoryDir)) {
    const existingCategories = fs
      .readdirSync(testsRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => `         - ${entry.name}`)
      .join('\n');

    fail(
      `Error: category directory does not exist: apps/src/tests/${category}\n` +
        `       Existing categories:\n${existingCategories}`,
    );
  }

  if (!fs.existsSync(templateScenario)) {
    fail(
      'Error: scenario.md template not found at apps/src/tests/template/scenario.md',
    );
  }

  if (fs.existsSync(targetDir)) {
    fail(
      `Error: target directory already exists: ${path.relative(
        repoRoot,
        targetDir,
      )}`,
    );
  }

  // Create the domain directory (if missing) and the test directory.
  fs.mkdirSync(targetDir, { recursive: true });

  // 1. Empty index.tsx
  fs.writeFileSync(path.join(targetDir, 'index.tsx'), '');

  // 2. scenario-description.ts from template, with name and key filled in.
  fs.writeFileSync(
    path.join(targetDir, 'scenario-description.ts'),
    scenarioDescriptionTemplate(screenName, testDirName),
  );

  // 3. scenario.md copied from the template (placeholders left intact).
  fs.copyFileSync(templateScenario, path.join(targetDir, 'scenario.md'));

  console.log(`Created test screen: ${path.relative(repoRoot, targetDir)}`);
  console.log('  - index.tsx (empty)');
  console.log(
    `  - scenario-description.ts (name='${screenName}', key='${testDirName}')`,
  );
  console.log('  - scenario.md (from template)');
}

main();
