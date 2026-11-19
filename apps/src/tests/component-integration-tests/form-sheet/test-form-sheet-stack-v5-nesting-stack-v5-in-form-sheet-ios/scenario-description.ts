import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Nested Stack v5 In FormSheet (iOS)',
  key: 'test-form-sheet-stack-v5-nesting-stack-v5-in-form-sheet-ios',
  details:
    'Stack v5 nested in a sheet: layout across detents and navigation state kept across dismiss/reopen.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    ipad: {
      createdOn: ['iPadOS 26.5'],
      testOn: ['iPadOS 26.5'],
    },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
