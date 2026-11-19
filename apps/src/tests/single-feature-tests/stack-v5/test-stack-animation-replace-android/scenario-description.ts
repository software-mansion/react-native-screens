import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Replace (Android)',
  key: 'test-stack-animation-replace-android',
  details:
    "Test the `replaceAnimation` prop: a replace plays the outgoing screen's " +
    "pop animation with `pop` and the incoming screen's push animation " +
    'with `push`, and the predictive back gesture after a replace',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationReplaceAndroid` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 33 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, the draw order over another screen and the interactive predictive back gesture are not assertable with Detox.',
  smokeTest: false,
};
