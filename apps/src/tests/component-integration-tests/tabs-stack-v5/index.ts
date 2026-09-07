import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTabsInStackStableEnterTransition from './test-stack-tabs-tabs-in-stack-stable-enter-transition';
import { default as TestStackTabsStackInTabsBaseNavigation } from './test-stack-tabs-stack-in-tabs-base-navigation';
import TestStackPreventNativeDismissTabsInStack from './test-stack-prevent-native-dismiss-tabs-in-stack';

export { default as TestTabsInStackStableEnterTransition } from './test-stack-tabs-tabs-in-stack-stable-enter-transition';
export { default as TestStackTabsStackInTabsBaseNavigation } from './test-stack-tabs-stack-in-tabs-base-navigation';
export { default as TestStackPreventNativeDismissTabsInStack } from './test-stack-prevent-native-dismiss-tabs-in-stack';

const scenarios = {
  TestTabsInStackStableEnterTransition,
  TestStackTabsStackInTabsBaseNavigation,
  TestStackPreventNativeDismissTabsInStack,
};

const StackTabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V5 & Native Tabs Integration Tests',
  details: 'Test interaction between StackContainer and TabsContainer',
  scenarios,
};

export default StackTabsScenarioGroup;
