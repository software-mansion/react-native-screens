import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Subviews (iOS)',
  key: 'test-stack-subviews-ios',
  details: 'Tests header config and subview customization.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 18.6', 'iOS 26.4'] },
    ipad: { createdOn: ['iPadOS 26.4'], testOn: ['iPadOS 26.4'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Every step is verified visually against the Dev Tools element-inspector overlay, which Detox cannot access, so the checks stay manual.',
  smokeTest: false,
};
