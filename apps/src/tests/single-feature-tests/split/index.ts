import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSplitTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestSplitCommandShowColumn from './test-command-show-column';
import TestSplitColorScheme from './test-split-color-scheme-ios';
import TestSplitPressables from './test-split-pressables-ios';

export { default as TestSplitTopColumnForCollapsing } from './test-top-column-for-collapsing';
export { default as TestSplitCommandShowColumn } from './test-command-show-column';
export { default as TestSplitColorScheme } from './test-split-color-scheme-ios';
export { default as TestSplitPressables } from './test-split-pressables-ios';

const scenarios = {
  TestSplitTopColumnForCollapsing,
  TestSplitCommandShowColumn,
  TestSplitColorScheme,
  TestSplitPressables,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
