import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Update (Android)',
  key: 'test-stack-animation-update-android',
  details:
    'Test changing the animation prop of a screen that is already on the ' +
    'stack: the new value drives the next pop of that screen, both on the top ' +
    'screen and on a covered one',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationUpdateAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The direction a screen moves in and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
