import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation None (Android)',
  key: 'test-stack-animation-none-android',
  details:
    'Test the none preset on Android: screens appear and disappear without ' +
    'motion or fading, and the predictive back gesture still pops',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationNoneAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The absence of motion and of a window-background flash, and the interactive predictive back gesture, are not assertable with Detox; only the resulting stack would be.',
  smokeTest: false,
};
