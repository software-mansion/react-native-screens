import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Search Tab Activation',
  key: 'test-tabs-search-tab-activation-ios',
  details:
    'Validates automaticallyActivatesSearch on a search-role tab with a search bar in the nested (legacy) stack header, including the UIKit hosted-search contract across push/pop (hosted field exists only at the stack root).',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 27.0'],
      testOn: ['iOS 27.0'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'FabricExample/e2e/component-integration-tests/tabs-stack-v4/test-tabs-search-tab-activation-ios.e2e.ts covers steps 1-2 of Returning through the collapsed tab bar. The remaining steps are not automated.',
  smokeTest: false,
};
