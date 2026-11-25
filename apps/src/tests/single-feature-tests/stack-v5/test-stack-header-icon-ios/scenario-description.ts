import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Icon (iOS)',
  key: 'test-stack-header-icon-ios',
  details:
    'Tests header item icons: SF Symbol, xcasset, imageSource, templateSource on bar button items and menu items, with runtime updates.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
    ipad: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'All steps are automated, but on iOS 27 icon visibility is not checked.',
  smokeTest: false,
};
