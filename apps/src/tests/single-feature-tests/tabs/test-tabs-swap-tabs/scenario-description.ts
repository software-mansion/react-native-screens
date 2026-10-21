import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Swap Tabs',
  key: 'test-tabs-swap-tabs',
  details:
    'Test replacing a TabsScreen at runtime, including the selected one, and selecting a tab added after the first selection.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
