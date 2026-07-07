import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stale update rejection',
  key: 'test-tabs-stale-update-rejection',
  details: 'Test stale update rejection mechanism',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
