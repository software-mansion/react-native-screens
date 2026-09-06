import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Overflow Icon',
  key: 'test-stack-overflow-icon-android',
  details:
    'Tests overflow menu icon customization: custom icon and tint colors.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
