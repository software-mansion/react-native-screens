import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack in Tabs - tab bar sidebar preferred placement',
  key: 'test-stack-tabs-tab-bar-sidebar-preferred-placement-stack-in-tabs-ios',
  details:
    'Test sidebar vs tab bar preferred placement with Stack v5 header in tabs (iOS 27+).',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 27.0'],
      testOn: ['iOS 27.0'],
    },
    ipad: {
      createdOn: ['iOS 27.0'],
      testOn: ['iOS 27.0'],
    },
  },
  deviceSetup: {
    iphone:
      'Plus or Max model, so that landscape has a regular horizontal size class.',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'Requires a regular horizontal size class on iPhone (landscape on Plus/Max models), which is not currently automated.',
  smokeTest: false,
};
