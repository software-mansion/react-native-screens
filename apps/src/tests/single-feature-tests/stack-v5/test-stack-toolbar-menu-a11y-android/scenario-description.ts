import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu A11y',
  key: 'test-stack-toolbar-menu-a11y-android',
  details: 'Tests accessibilityLabel on toolbar menu items. ',
  platforms: ['android'],
  e2eCoverage: 'full',
  smokeTest: false,
};
