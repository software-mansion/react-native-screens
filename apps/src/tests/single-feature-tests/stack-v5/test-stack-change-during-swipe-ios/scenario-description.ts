import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Change During Swipe',
  key: 'test-stack-change-during-swipe-ios',
  details:
    'Test a push or pop the app makes while a back swipe is held: nothing ' +
    'changes under the finger, the swipe ends as released, then the change ' +
    'plays and later back swipes walk the stack in order',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 18.6', 'iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  deviceSetup: {
    iphone:
      'System animations on (Settings → Accessibility → Motion → Reduce Motion is off).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. A held swipe is not available in Detox.',
  smokeTest: false,
};
