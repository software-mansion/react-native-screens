import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTabsInStackStableEnterTransition from './test-stack-tabs-tabs-in-stack-stable-enter-transition';
import { default as TestStackTabsStackInTabsBaseNavigation } from './test-stack-tabs-stack-in-tabs-base-navigation';
import { default as TestStackTabsStackInTabsHeaderPersistence } from './test-stack-tabs-stack-in-tabs-header-persistence';
import TestTabsTabBarSidebarPreferredPlacement from './test-tabs-tab-bar-sidebar-preferred-placement-ios';

export { default as TestTabsInStackStableEnterTransition } from './test-stack-tabs-tabs-in-stack-stable-enter-transition';
export { default as TestStackTabsStackInTabsBaseNavigation } from './test-stack-tabs-stack-in-tabs-base-navigation';
export { default as TestStackTabsStackInTabsHeaderPersistence } from './test-stack-tabs-stack-in-tabs-header-persistence';
export { default as TestTabsTabBarSidebarPreferredPlacement } from './test-tabs-tab-bar-sidebar-preferred-placement-ios';

const scenarios = {
  TestTabsInStackStableEnterTransition,
  TestStackTabsStackInTabsBaseNavigation,
  TestStackTabsStackInTabsHeaderPersistence,
  TestTabsTabBarSidebarPreferredPlacement,
};

const StackTabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V5 & Native Tabs Integration Tests',
  details: 'Test interaction between StackContainer and TabsContainer',
  scenarios,
};

export default StackTabsScenarioGroup;
