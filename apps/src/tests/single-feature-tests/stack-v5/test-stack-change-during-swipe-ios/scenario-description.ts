import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Change During Swipe',
  key: 'test-stack-change-during-swipe-ios',
  details:
    'Test a push or pop the app makes while a back swipe is held: nothing ' +
    'changes under the finger, the swipe ends as released, then the change ' +
    'plays and later back swipes walk the stack in order',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
