const fs = require('fs');
const path = require('path');
import type { ScenarioDescription } from '../../apps/src/tests/shared/helpers.ts';

type E2eCoverage = ScenarioDescription['e2eCoverage'];

interface ScenarioFile {
  file: string;
  subdirectory: string;
}

type TableColumn =
  | { header: string; prop: keyof ScenarioDescription }
  | { header: string; prop: null; defaultValue: string };

interface Entry extends ScenarioDescription {
  subdirectory: string;
}

const DEFAULT_TESTS_DIR = path.resolve(__dirname, '../../apps/src/tests');
const SCENARIO_FILENAME = 'scenario-description.ts';
const OBJECT_NAME = 'scenarioDescription';

const TABLE_COLUMNS: TableColumn[] = [
  { header: 'Mark', prop: null, defaultValue: '[ ]' },
  { header: 'Test Name', prop: 'name' },
  { header: 'E2E Coverage', prop: 'e2eCoverage' },
  { header: 'Key', prop: 'key' },
];

const COVERAGE_ORDER: Record<E2eCoverage, number> = {
  full: 0,
  incomplete: 1,
  tbd: 2,
};

function getCustomTestPath(): string | null {
  const flagIndex = process.argv.indexOf('--test-path');
  if (flagIndex !== -1 && flagIndex + 1 < process.argv.length) {
    return process.argv[flagIndex + 1];
  }
  return null;
}

function findScenarioFiles(dir: string, baseDir: string = dir): ScenarioFile[] {
  let results: ScenarioFile[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      results = results.concat(findScenarioFiles(fullPath, baseDir));
    } else if (item.isFile() && item.name === SCENARIO_FILENAME) {
      const relativePath = path.relative(baseDir, dir);

      results.push({
        file: fullPath,
        subdirectory: relativePath === '' ? 'root' : relativePath,
      });
    }
  }

  return results;
}

async function parseScenarioFile(
  filePath: string,
): Promise<ScenarioDescription | null> {
  try {
    const module = require(filePath);
    return module[OBJECT_NAME];
  } catch (e) {
    console.error(
      `Warning: could not import ${filePath}: ${(e as Error).message}`,
    );
    return null;
  }
}

function compareEntries(a: Entry, b: Entry): number {
  const coverageDiff =
    COVERAGE_ORDER[a.e2eCoverage] - COVERAGE_ORDER[b.e2eCoverage];
  if (coverageDiff !== 0) {
    return coverageDiff;
  }

  if (a.key !== b.subdirectory) {
    return a.subdirectory.localeCompare(b.subdirectory);
  }

  return a.key.localeCompare(b.key);
}

function formatTable(entries: Entry[]): string {
  if (entries.length === 0) {
    return 'No tests in this category.\n';
  }

  const cellValue = (col: TableColumn, entry: Entry) =>
    col.prop !== null
      ? String(entry[col.prop as keyof Entry] ?? 'N/A')
      : col.defaultValue;

  const colWidths = TABLE_COLUMNS.map(col =>
    Math.max(col.header.length, ...entries.map(e => cellValue(col, e).length)),
  );

  const row = (values: string[]) =>
    '| ' + values.map((v, i) => v.padEnd(colWidths[i])).join(' | ') + ' |';

  const separator = '| ' + colWidths.map(w => '-'.repeat(w)).join(' | ') + ' |';

  const lines = [
    row(TABLE_COLUMNS.map(col => col.header)),
    separator,
    ...entries.map(e => row(TABLE_COLUMNS.map(col => cellValue(col, e)))),
  ];

  return lines.join('\n') + '\n';
}

async function main() {
  const allEntries: Entry[] = [];

  const customTestPath = getCustomTestPath();
  const searchDir = customTestPath
    ? path.resolve(process.cwd(), customTestPath)
    : path.resolve(__dirname, DEFAULT_TESTS_DIR);

  const files = findScenarioFiles(searchDir);

  for (const { file, subdirectory } of files) {
    const parsed = await parseScenarioFile(file);
    if (parsed) {
      allEntries.push({
        ...parsed,
        subdirectory,
      });
    }
  }

  const smokeTests = allEntries.filter(e => e.smokeTest).sort(compareEntries);
  const nonSmokeTests = allEntries
    .filter(e => !e.smokeTest)
    .sort(compareEntries);

  const output = [
    '## Smoke Tests\n',
    formatTable(smokeTests),
    '',
    '## Non-Smoke Tests\n',
    formatTable(nonSmokeTests),
  ].join('\n');

  process.stdout.write(output);
}

main();
