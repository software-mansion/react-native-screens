import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Swipe During Transition',
  key: 'test-stack-animation-swipe-during-transition-ios',
  details:
    'Test a back swipe that starts while a custom push or pop is still ' +
    'running: the running transition jumps to its end and the swipe pops ' +
    'one screen, following the finger',
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
    'No step is automated. For manual testing perform all steps. A swipe that starts during a transition is not available in Detox.',
  smokeTest: false,
};
