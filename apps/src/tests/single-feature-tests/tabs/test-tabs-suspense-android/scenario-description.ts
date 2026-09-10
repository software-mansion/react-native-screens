import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Suspense container restoration',
  key: 'test-tabs-suspense-android',
  details:
    'Test restoring the native tabs container after its selected tab suspends',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
