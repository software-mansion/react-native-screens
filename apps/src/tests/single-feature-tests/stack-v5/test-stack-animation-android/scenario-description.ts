import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation (Android)',
  key: 'test-stack-animation-android',
  details:
    'Test how a stack transition runs with the default animation on Android: ' +
    'push, pop, the predictive back gesture, the draw order over a static ' +
    'screen, a nested container and a right-to-left host',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': {
      createdOn: ['API Level 37', 'API Level 30'],
      testOn: ['API Level 37', 'API Level 30'],
    },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 33 or newer for all groups except "`default` below API 33", which needs a second device on API 32 or older. Step 2 of "Header and system back button" on a physical device needs 3-button navigation (on an emulator, use its back button).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The direction a screen moves in, the travel distance, the scale, the draw order over a static screen and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: true,
};
