import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Root Replacement (Android)',
  key: 'test-stack-root-replacement-android',
  details:
    'Replace the root or entire history, then push and navigate back without restoring removed screens.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
