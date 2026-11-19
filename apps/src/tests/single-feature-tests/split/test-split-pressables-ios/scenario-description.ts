import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split pressables',
  key: 'test-split-pressables-ios',
  details: 'Allows to test pressability of components inside Split columns.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.4'],
      testOn: ['iOS 18.6', 'iOS 26.4'],
    },
    ipad: {
      createdOn: ['iPadOS 18.6', 'iPadOS 26.4'],
      testOn: ['iPadOS 18.6', 'iPadOS 26.4'],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
