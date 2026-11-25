import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Update',
  key: 'test-stack-animation-update',
  details:
    'Test changing the animation prop of a screen that is already on the ' +
    'stack: the new value drives the next pop of that screen, both on the top ' +
    'screen and on a covered one',
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
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationUpdate` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The direction a screen moves in and the interactive back gestures are not assertable with Detox.',
  smokeTest: false,
};
