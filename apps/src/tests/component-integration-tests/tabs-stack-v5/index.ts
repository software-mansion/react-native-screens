import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTabsInStackStableEnterTransition from './test-stack-tabs-tabs-in-stack-stable-enter-transition';

export { default as TestTabsInStackStableEnterTransition } from './test-stack-tabs-tabs-in-stack-stable-enter-transition';

const scenarios = { TestTabsInStackStableEnterTransition };

const StackTabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V5 & Native Tabs Integration Tests',
  details: 'Test interaction between StackContainer and TabsContainer',
  scenarios,
};

export default StackTabsScenarioGroup;
