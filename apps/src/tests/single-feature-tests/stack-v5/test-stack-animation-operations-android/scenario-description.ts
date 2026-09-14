import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Animation Operations Android',
  key: 'test-stack-animation-operations-android',
  details:
    'Routes with fixed, distinct slide presets to check which animation plays for push, multi-push, pop, multi-pop, replace and multi-replace on Android',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
