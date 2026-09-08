import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu State (Android)',
  key: 'test-stack-toolbar-menu-state-android',
  details:
    'Tests that toolbar menu selections and updateToolbarMenuElements ' +
    'results survive native header rebuilds, that only a real toolbarMenu ' +
    'change resets them, and that commands sent while the header is hidden ' +
    'are recorded and emit their events.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
