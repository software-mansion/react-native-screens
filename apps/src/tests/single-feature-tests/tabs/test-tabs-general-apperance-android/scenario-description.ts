import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Appearance',
  key: 'test-tabs-general-apperance-android',
  details: 'Tests Android tab bar appearance: default system rendering, label visibility, ripple effect, and active indicator.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
