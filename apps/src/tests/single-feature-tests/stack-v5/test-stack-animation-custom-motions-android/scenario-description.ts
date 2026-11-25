import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Custom Motions (Android)',
  key: 'test-stack-animation-custom-motions-android',
  details:
    "Test an animation of Stack.Screen with a screen's motion written as tracks " +
    'on Android: translation, opacity, scale, rotation and a dim scrim, each ' +
    'track with its own duration and delay, omitted endpoints and the fallback ' +
    'to default for an invalid track',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationCustomMotionsAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, for how long, the scrim and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
