import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TabsInStackStableEnterTransition from './test-stack-tabs-tabs-in-stack-stable-enter-transition';

const scenarios = { TabsInStackStableEnterTransition };

const StackTabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack V5 & Native Tabs Integration Tests',
  details: 'Test interaction between StackContainer and TabsContainer',
  scenarios,
};

export default StackTabsScenarioGroup;
