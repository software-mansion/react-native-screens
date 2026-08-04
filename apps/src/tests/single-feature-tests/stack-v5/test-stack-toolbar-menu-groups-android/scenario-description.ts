import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Groups (Android)',
  key: 'test-stack-toolbar-menu-groups-android',
  details:
    'Tests toolbar menu groups: multi-toggle, single-selection, nested submenu groups, callbacks, imperative commands (checked, title, hidden), dividers, and props rebuild.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
