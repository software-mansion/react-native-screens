import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Deferred push',
  key: 'test-stack-deferred-push',
  details: 'Hold a push while its destination lays out.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
