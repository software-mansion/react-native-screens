import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Conditional Tabs',
  key: 'test-tabs-conditional-tabs',
  details:
    'Test removing and re-adding TabsScreens at runtime (conditional rendering), together with tabBarHidden.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
