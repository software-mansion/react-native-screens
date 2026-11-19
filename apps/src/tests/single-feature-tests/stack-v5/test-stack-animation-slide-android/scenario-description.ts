import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Slide Presets (Android)',
  key: 'test-stack-animation-slide-android',
  details:
    'Test the four slide presets on Android: the horizontal ones move both ' +
    'screens, the vertical ones move only one, and none of them mirrors in RTL',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationSlideAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). The interactive predictive back gesture needs API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The direction a screen moves in, whether the other screen moves with it and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
