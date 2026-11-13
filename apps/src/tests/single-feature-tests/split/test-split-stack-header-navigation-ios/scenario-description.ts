import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack header and navigation',
  key: 'test-split-stack-header-navigation-ios',
  details:
    'Header items and push/pop of a Stack.Host that navigates a Split column.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
