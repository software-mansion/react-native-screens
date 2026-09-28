import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTabsSearchTabActivation from './test-tabs-search-tab-activation-ios';

export { default as TestTabsSearchTabActivation } from './test-tabs-search-tab-activation-ios';

const scenarios = {
  TestTabsSearchTabActivation,
};

const TabsStackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V4 & Native Tabs Integration Tests',
  details: 'Test interaction between TabsContainer and the legacy (v4) stack',
  scenarios,
};

export default TabsStackV4ScenarioGroup;
