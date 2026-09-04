import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack header hidden restore',
  key: 'test-stack-header-hidden-restore-android',
  details:
    'Test how the header collapse state is restored when hidden is toggled off',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
