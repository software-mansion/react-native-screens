import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Options (Android)',
  key: 'test-stack-animation-options-android',
  details:
    'Test the duration, easing and distance options of an animation preset ' +
    'on Android, and the fallback to default for an invalid value',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationOptionsAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Durations, curves, travel distances and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
