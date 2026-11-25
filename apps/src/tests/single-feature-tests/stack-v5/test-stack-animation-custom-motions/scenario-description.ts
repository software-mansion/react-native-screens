import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Custom Motions',
  key: 'test-stack-animation-custom-motions',
  details:
    "Test an animation of Stack.Screen with a screen's motion written as tracks: " +
    'translation, opacity, scale, rotation and a dim scrim, each track with its ' +
    'own duration and delay, omitted endpoints and the fallback to default for ' +
    'an invalid track',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 18.6', 'iOS 27.2'], testOn: ['iOS 27.2'] },
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    iphone:
      'System animations on (Settings → Accessibility → Motion → Reduce Motion is off).',
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationCustomMotions` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, for how long, the scrim, the header during the transition and the interactive back gestures are not assertable with Detox.',
  smokeTest: false,
};
