import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TabsInStackStableEnterTransition from './test-stack-tabs-tabs-in-stack-stable-enter-transition';
import { default as TestStackTabsStackInTabsBaseNavigation } from './test-stack-tabs-stack-in-tabs-base-navigation';

const scenarios = {
  TabsInStackStableEnterTransition,
  TestStackTabsStackInTabsBaseNavigation,
};

const StackTabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V5 & Native Tabs Integration Tests',
  details: 'Test interaction between StackContainer and TabsContainer',
  scenarios,
};

export default StackTabsScenarioGroup;
