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
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'Sections A–E are automatable (every check is on menu state, not on colors or drawables), but the spec has not been written yet. Section F is not automatable: Detox cannot read a drawable, so it cannot tell which image an action button shows. Verify it visually.',
  smokeTest: false,
};
