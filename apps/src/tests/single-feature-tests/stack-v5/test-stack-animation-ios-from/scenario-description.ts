import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation iosFrom Presets',
  key: 'test-stack-animation-ios-from',
  details:
    'Test the iOS presets: the covered screen recedes and darkens behind the ' +
    'incoming one, no dim tint is left behind after a pop, and in RTL only ' +
    'the trailing and leading ones mirror',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 18.6', 'iOS 27.2'], testOn: ['iOS 27.2'] },
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    iphone:
      'System animations on (Settings → Accessibility → Motion → Reduce Motion is off). Every group runs at normal speed (350 ms transitions); judge the tint from a screen recording if needed.',
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationIOSFrom` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). The interactive predictive back gesture needs API 34 or newer. For the groups whose heading says "Android: 10x animation scale, iOS: normal" only: in Developer options set "Animator duration scale" and "Transition animation scale" to 10x before the first of them and back to 1x after the last (at 1x these transitions last 200 ms and the tint cannot be compared against a swatch by eye).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The tint, the travel distances, the draw order, the header during the transition and the interactive back gestures are not assertable with Detox.',
  smokeTest: false,
};
