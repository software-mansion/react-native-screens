import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lazy rendering',
  key: 'test-tabs-lazy-rendering',
  details:
    'Verifies that the transition waits for lazily rendered tabs instead of flashing blank page before transitioning.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
