import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Overflow Icon',
  key: 'test-stack-overflow-icon-android',
  details:
    'Tests overflow menu icon customization: custom icon and tint colors.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    'android-phone':
      'To test overflowIconTintColorFocused: enable Hardware Input in the emulator settings, then use arrow keys to enable keyboard focus and press Ctrl+Tab to move keyboard focus into the header toolbar.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    "Not automated. The checkpoints verify the overflow button's rendered icon and tint colors, which Detox cannot assert (no color/drawable data in getAttributes(), no screenshot comparison). The pressed and focused tints additionally require mid-press observation and hardware-keyboard focus. This scenario is manual only.",
  smokeTest: false,
};
