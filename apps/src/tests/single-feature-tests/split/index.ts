import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSplitTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestSplitCommandShowColumn from './test-command-show-column';
import TestSplitColorScheme from './test-split-color-scheme-ios';

export { TestSplitTopColumnForCollapsing } from './test-top-column-for-collapsing';
export { TestSplitCommandShowColumn } from './test-command-show-column';
export { TestSplitColorScheme } from './test-split-color-scheme-ios';

const scenarios = {
  TestSplitTopColumnForCollapsing,
  TestSplitCommandShowColumn,
  TestSplitColorScheme,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
