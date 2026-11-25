import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation iOS Presets (Android)',
  key: 'test-stack-animation-ios-android',
  details:
    'Test the iOS presets on Android: the covered screen recedes and darkens ' +
    'behind the incoming one, and no dim tint is left behind after a pop, a ' +
    'cancelled gesture or a committed one',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationIOSAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). The interactive predictive back gesture needs API 34 or newer. For the groups whose heading says "with extended animation duration scale" only: in Developer options set "Animator duration scale" and "Transition animation scale" to 10x before the first of them and back to 1x after the last (at 1x these transitions are 200 ms long and the tint cannot be compared against a swatch by eye).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The tint, the travel distances, the draw order and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
