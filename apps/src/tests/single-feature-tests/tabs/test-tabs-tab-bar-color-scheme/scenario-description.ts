import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Color Scheme',
  key: 'test-tabs-tab-bar-color-scheme',
  details: 'Tests how tabs handle system, React Native and prop color scheme.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
