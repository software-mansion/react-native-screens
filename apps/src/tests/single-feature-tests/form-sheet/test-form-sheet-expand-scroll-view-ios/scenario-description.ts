import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Expand On Scroll To Edge (iOS)',
  key: 'test-form-sheet-expand-scroll-view-ios',
  details:
    'prefersScrollingExpandsWhenScrolledToEdge with a nested ScrollView: does scrolling expand the sheet.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    ipad: { createdOn: ['iPadOS 26.5'], testOn: ['iPadOS 26.5'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
