import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
