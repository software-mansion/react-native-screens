import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Disabled',
  key: 'test-stack-toolbar-menu-disabled-android',
  details:
    'Tests the disabled prop on toolbar menu items (action items, checkable group items, and submenus), both via props and via the updateToolbarMenuElements view command.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers all steps. Not automated: the greyed-out appearance itself (iconTintColorNormal vs iconTintColorDisabled on the action-bar button, and the greyed label of disabled menu rows). Detox cannot read a tint, so the steps asserting one are covered through the native enabled attribute instead. Verify the colors visually.',
  smokeTest: false,
};
