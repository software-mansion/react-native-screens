import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Batch Commands',
  key: 'test-stack-toolbar-menu-batch-commands-android',
  details:
    'Tests batched updates via the updateToolbarMenuElements view command: ' +
    'per-batch coalescing of onSelectionChange (one event per group), ' +
    'batches mixing async image loads with plain checks, and FIFO ordering ' +
    'of back-to-back commands (a late image load must not override a newer ' +
    'command).',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
