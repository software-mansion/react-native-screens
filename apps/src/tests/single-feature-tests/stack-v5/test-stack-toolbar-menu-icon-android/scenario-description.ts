import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Icon',
  key: 'test-stack-toolbar-menu-icon-android',
  details:
    'Tests the icon and state-aware tint props on toolbar menu items, both via props and via the setToolbarMenuElementOptions view command.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
