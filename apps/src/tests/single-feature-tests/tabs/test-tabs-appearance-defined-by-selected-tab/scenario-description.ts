import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab-Specific Appearance',
  key: 'test-tabs-appearance-defined-by-selected-tab',
  details:
    'Verifies that the tab bar dynamically updates to reflect the styling of the selected tab.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
