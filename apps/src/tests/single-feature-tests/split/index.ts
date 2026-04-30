import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestCommandShowColumn from './test-command-show-column';
import TestColorScheme from './test-split-color-scheme';

const scenarios = {
  TestTopColumnForCollapsing,
  TestCommandShowColumn,
  TestColorScheme,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
