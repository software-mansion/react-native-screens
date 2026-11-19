import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Nested Menu',
  key: 'test-stack-toolbar-nested-menu-android',
  details:
    'Tests toolbar menu submenus: rendering nested menus, click handling ' +
    'at all nesting levels, imperative commands targeting items inside ' +
    'submenus and submenu containers, and props-update rebuild semantics.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'full',
  e2eCoverageDetails:
    "Covers all steps. Imperative command — change menuTitle step 3 and Props change — structural changes step 7 leave the submenu entry with no text for Detox to match, so both are reached by their position among the overflow menu's rows instead. The absence of a submenu header is asserted indirectly, as a header would show up as an extra match for the text it renders.",
  smokeTest: false,
};
