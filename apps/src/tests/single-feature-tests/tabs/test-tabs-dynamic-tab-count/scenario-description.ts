import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Dynamic Tab Count',
  key: 'test-tabs-dynamic-tab-count',
  details:
    'Test removing and re-adding TabsScreens at runtime (conditional rendering).',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
