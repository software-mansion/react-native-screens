import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Nested scroll interop (Android)',
  key: 'test-stack-nested-scroll-interop-android',
  details:
    'Verify Stack v5 can forward its remaining Android nested-scroll transaction to an external delegate.',
  platforms: ['android'],
  e2eCoverage: 'complete',
  smokeTest: false,
};
