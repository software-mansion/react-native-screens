import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack lifecycle events',
  key: 'test-stack-lifecycle-events',
  details:
    'Verify lifecycle events (onWillAppear, etc.) fire on stack navigation',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
