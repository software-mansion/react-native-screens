import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack integration disabled',
  key: 'test-split-stack-integration-disabled-ios',
  details:
    'A Split column with disableStackIntegration keeps a Stack.Host nested as plain content.',
  platforms: ['ios'],
  devices: ['ipad'],
  osVersions: {
    ipad: { createdOn: ['iOS 27.0'], testOn: ['iOS 27.0'] },
  },
  deviceSetup: {
    ipad: 'Landscape, so that both columns are visible.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
