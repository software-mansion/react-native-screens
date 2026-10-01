import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Menu Action State (iOS)',
  key: 'test-stack-header-menu-action-state-ios',
  details:
    'Tests application-owned action state and native toggle distinctions.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
