import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Swipe During Transition',
  key: 'test-stack-animation-swipe-during-transition-ios',
  details:
    'Test a back swipe that starts while a custom push or pop is still ' +
    'running: the running transition jumps to its end and the swipe pops ' +
    'one screen, following the finger',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
