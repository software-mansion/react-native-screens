import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Simple stack navigation',
  key: 'test-stack-simple-nav',
  details: 'Test simple push and pop operations',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
