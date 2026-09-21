import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Search Tab Activation',
  key: 'test-tabs-search-tab-activation-ios',
  details:
    'Validates automaticallyActivatesSearch on a searchRole tab with a search bar in the nested (legacy) stack header, including the UIKit hosted-search contract across push/pop (hosted field exists only at the stack root).',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
