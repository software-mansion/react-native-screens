import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSplitStackV5InTabs from './test-split-stack-v5-nesting-stack-v5-in-tabs-ios';
import TestSplitStackV5InFormSheet from './test-split-stack-v5-nesting-stack-v5-in-form-sheet-ios';
import TestSplitStackV5InContainedModal from './test-split-stack-v5-nesting-stack-v5-in-contained-modal-ios';
import TestSplitStackColumnLayoutAfterCollapse from './test-split-stack-column-layout-after-collapse-ios';
import TestSplitStackHeaderNavigation from './test-split-stack-header-navigation-ios';
import TestSplitStackLifecycleEvents from './test-split-stack-lifecycle-events-ios';
import TestSplitStackContentSwap from './test-split-stack-content-swap-ios';
import TestSplitStackIntegrationDisabled from './test-split-stack-integration-disabled-ios';
import TestSplitStackPressables from './test-split-stack-pressables-ios';
import TestSplitStackOnlyChildRule from './test-split-stack-only-child-rule-ios';

export { default as TestSplitStackV5InTabs } from './test-split-stack-v5-nesting-stack-v5-in-tabs-ios';
export { default as TestSplitStackV5InFormSheet } from './test-split-stack-v5-nesting-stack-v5-in-form-sheet-ios';
export { default as TestSplitStackV5InContainedModal } from './test-split-stack-v5-nesting-stack-v5-in-contained-modal-ios';
export { default as TestSplitStackColumnLayoutAfterCollapse } from './test-split-stack-column-layout-after-collapse-ios';
export { default as TestSplitStackHeaderNavigation } from './test-split-stack-header-navigation-ios';
export { default as TestSplitStackLifecycleEvents } from './test-split-stack-lifecycle-events-ios';
export { default as TestSplitStackContentSwap } from './test-split-stack-content-swap-ios';
export { default as TestSplitStackIntegrationDisabled } from './test-split-stack-integration-disabled-ios';
export { default as TestSplitStackPressables } from './test-split-stack-pressables-ios';
export { default as TestSplitStackOnlyChildRule } from './test-split-stack-only-child-rule-ios';

const scenarios = {
  TestSplitStackV5InTabs,
  TestSplitStackV5InFormSheet,
  TestSplitStackV5InContainedModal,
  TestSplitStackColumnLayoutAfterCollapse,
  TestSplitStackHeaderNavigation,
  TestSplitStackLifecycleEvents,
  TestSplitStackContentSwap,
  TestSplitStackIntegrationDisabled,
  TestSplitStackPressables,
  TestSplitStackOnlyChildRule,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split Integration Tests',
  details: 'Test interaction between Split and different components',
  scenarios,
};

export default SplitScenarioGroup;
