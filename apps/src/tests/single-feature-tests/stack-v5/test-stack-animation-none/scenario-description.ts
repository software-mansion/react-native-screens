import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation None',
  key: 'test-stack-animation-none',
  details:
    'Test the none preset: screens and the header appear and disappear ' +
    'without motion or fading, and the back gesture still pops',
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
      'Gesture navigation enabled. System animations on (Settings → Accessibility → Color and motion → Remove animations is off). Run the screen directly: in `apps/App.tsx` import and render `TestStackAnimationNone` as the root component instead of `Example` (opened through the in-app menu, system back leaves the screen instead of popping the stack).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The absence of motion and of a window-background flash, and the interactive back gesture, are not assertable with Detox; only the resulting stack would be.',
  smokeTest: false,
};
