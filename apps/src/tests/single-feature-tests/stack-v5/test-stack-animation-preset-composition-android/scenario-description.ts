import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Composition (Android)',
  key: 'test-stack-animation-preset-composition-android',
  details:
    'Test an animation of Stack.Screen composed from presets on Android: ' +
    'push and pop transitions named separately, per-screen motions with ' +
    'their options, omitted parts and the fallback to default for an invalid value',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationPresetCompositionAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, for how long, the draw order and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
