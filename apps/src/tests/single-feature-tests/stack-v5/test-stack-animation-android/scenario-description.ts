import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Animation Android',
  key: 'test-animation-android',
  details: 'High contrast screens to test animations on Android',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
