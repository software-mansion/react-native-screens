import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Disabled',
  key: 'test-stack-toolbar-menu-disabled-android',
  details:
    'Tests the disabled prop on toolbar menu items (action items, checkable group items, and submenus), both via props and via the updateToolbarMenuElements view command.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
