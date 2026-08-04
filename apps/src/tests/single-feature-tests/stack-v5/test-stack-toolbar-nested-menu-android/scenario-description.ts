import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Nested Menu',
  key: 'test-stack-toolbar-nested-menu-android',
  details:
    'Tests toolbar menu submenus: rendering nested menus, click handling ' +
    'at all nesting levels, imperative commands targeting items inside ' +
    'submenus and submenu containers, and props-update rebuild semantics.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
