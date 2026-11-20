import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack integration disabled',
  key: 'test-split-stack-integration-disabled-ios',
  details:
    'A Split column with disableStackIntegration keeps a Stack.Host nested as plain content.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
