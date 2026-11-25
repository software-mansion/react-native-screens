import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack lifecycle events',
  key: 'test-split-stack-lifecycle-events-ios',
  details:
    'Lifecycle events of a Split column navigated by a Stack.Host and of its screens.',
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
