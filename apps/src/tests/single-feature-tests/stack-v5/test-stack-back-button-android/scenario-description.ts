import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Button (Android)',
  key: 'test-stack-back-button-android',
  details: 'Tests back button customization: hidden, tint color, custom icon.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    'android-phone':
      'Hardware Input enabled in the emulator settings (needed to test backButtonTintColorFocused).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Automated: all steps of Baseline, steps 7-8 of Icon: `default` and all steps of Config applied before push, asserting only that the back button is absent or present; step 1 of Config applied before push is reached by reloading the screen rather than navigating back. Manual only: steps 1-6 of Icon: `default`, steps 1-3 of Icon: `imageSource` and changes when hidden and steps 1-3 of Icon: `drawableResource` (tint colors and icon identity); steps 4-6 of Icon: `imageSource` and changes when hidden and steps 4-5 of Icon: `drawableResource` (the `backButtonHidden` toggle already covered by steps 7-8 of Icon: `default` for default button settings).',
  smokeTest: false,
};
