import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'More navigation controller',
  key: 'test-tabs-more-navigation-controller-ios',
  details: 'Test navigation and interactions with "More Navigation Controller"',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    ipad: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Ongoing research.',
  smokeTest: false,
};
