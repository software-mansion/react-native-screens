import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Options',
  key: 'test-stack-animation-options',
  details:
    'Test the duration, easing and distance options of an animation preset ' +
    'and the fallback to default for an invalid value',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 18.6', 'iOS 27.2'], testOn: ['iOS 27.2'] },
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    iphone:
      'System animations on (Settings → Accessibility → Motion → Reduce Motion is off). Every group runs at normal speed.',
    'android-phone':
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationOptions` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Durations, curves, travel distances, the header during the transition and the interactive back gestures are not assertable with Detox.',
  smokeTest: false,
};
