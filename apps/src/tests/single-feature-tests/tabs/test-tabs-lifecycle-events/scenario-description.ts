import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Tabs lifecycle events',
  key: 'test-tabs-lifecycle-events',
  details:
    'Verify lifecycle events (onWillAppear, etc.) fire on tab switch',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

export default scenarioDescription;
