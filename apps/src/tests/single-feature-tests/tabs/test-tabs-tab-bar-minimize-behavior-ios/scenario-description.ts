import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Minimize Behavior',
  key: 'test-tabs-tab-bar-minimize-behavior-ios',
  details: 'Test tab bar minimize behavior for iOS 26+.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.2'], testOn: ['iOS 26.2'] },
    ipad: { createdOn: ['iOS 26.2'], testOn: ['iOS 26.2'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Standard view-hierarchy testing is insufficient because the tab bar element persists in the hierarchy after being collapsed.',
  smokeTest: false,
};
