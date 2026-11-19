import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSplitStackV5InTabs from './test-split-stack-v5-nesting-stack-v5-in-tabs-ios';
import TestSplitStackV5InFormSheet from './test-split-stack-v5-nesting-stack-v5-in-form-sheet-ios';
import TestSplitStackV5InContainedModal from './test-split-stack-v5-nesting-stack-v5-in-contained-modal-ios';

export { default as TestSplitStackV5InTabs } from './test-split-stack-v5-nesting-stack-v5-in-tabs-ios';
export { default as TestSplitStackV5InFormSheet } from './test-split-stack-v5-nesting-stack-v5-in-form-sheet-ios';
export { default as TestSplitStackV5InContainedModal } from './test-split-stack-v5-nesting-stack-v5-in-contained-modal-ios';

const scenarios = {
  TestSplitStackV5InTabs,
  TestSplitStackV5InFormSheet,
  TestSplitStackV5InContainedModal,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split Integration Tests',
  details: 'Test interaction between Split and different components',
  scenarios,
};

export default SplitScenarioGroup;
