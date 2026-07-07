import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Selective Updates (iOS)',
  key: 'test-stack-header-selective-updates-ios',
  details:
    'Tests that header item updates are scoped — only the changed item rebuilds. On iOS 26+, item rebuild causes a visible flash/blur on the affected bar button.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
