import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Animation Android',
  key: 'test-stack-animation-android',
  details: 'High contrast screens to test animations on Android',
  platforms: ['android'],
  devices: ['android-phone'],
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
