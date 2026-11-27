import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Slide Presets',
  key: 'test-stack-animation-slide',
  details:
    'Test the slide presets: the horizontal ones move both screens, the ' +
    'vertical ones move only one, on Android in RTL only the trailing and ' +
    'leading ones mirror, and on iOS the header back button and menu pop ' +
    'with the preset',
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
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationSlide` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack). The interactive predictive back gesture needs API 34 or newer.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The direction a screen moves in, whether the other screen moves with it, the header during the transition and the interactive back gestures are not assertable with Detox.',
  smokeTest: false,
};
