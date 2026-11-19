import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Fade Presets (Android)',
  key: 'test-stack-animation-fade-android',
  details:
    'Test the fade presets on Android: fade crossfades both screens ' +
    'symmetrically, while fadeFromBottom and fadeFromTop move and fade one ' +
    'screen and pop over less time than they push',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationFadeAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). The interactive predictive back gesture needs API 34 or newer. For the groups whose heading says "with extended animation duration scale" only: in Developer options set "Animator duration scale" and "Transition animation scale" to 5x before the first of them and back to 1x after the last.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Opacity, the short travel distance and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
