import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets-android',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
  e2eCoverage: 'full',
  smokeTest: false,
};
