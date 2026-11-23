import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack pressables',
  key: 'test-split-stack-pressables-ios',
  details: 'Pressability of components in Split columns navigated by a stack.',
  platforms: ['ios'],
  devices: ['ipad'],
  osVersions: {
    ipad: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  deviceSetup: {
    ipad: 'Portrait, full screen.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
