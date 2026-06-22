import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Integration: SVM in Stack - special effects',
  key: 'test-stack-svm-tabs-special-effects',
  details:
    'Test whether special effects (on tab repetition) are performed correctly in nested container scenario ' +
    '(stack in tabs)',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
