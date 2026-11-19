import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Icon',
  key: 'test-stack-toolbar-menu-icon-android',
  details:
    'Tests the icon and state-aware tint props on toolbar menu items, both via props and via the updateToolbarMenuElements view command.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    'android-phone':
      'To test iconTintColorFocused: enable Hardware Input in the emulator settings, then use arrow keys to enable keyboard focus and press Ctrl+Tab to move keyboard focus into the header toolbar.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Almost every check verifies which drawable is shown and its tint color per interaction state (normal / pressed / focused / disabled), pixel-level visual assertions Detox cannot express. The pressed and focused states additionally require observing rendering mid-gesture and hardware keyboard focus, neither of which Detox supports.',
  smokeTest: false,
};
