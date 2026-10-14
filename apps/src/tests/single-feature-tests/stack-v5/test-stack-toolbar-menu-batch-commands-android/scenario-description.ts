import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Batch Commands',
  key: 'test-stack-toolbar-menu-batch-commands-android',
  details:
    'Tests batched updates via the updateToolbarMenuElements view command.',
  platforms: ['android'],
  devices: ['android-phone'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
