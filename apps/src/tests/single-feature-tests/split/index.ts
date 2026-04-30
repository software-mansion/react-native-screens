import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestCommandShowColumn from './test-command-show-column';
import TestDirection from './test-split-direction';

const scenarios = {
  TestTopColumnForCollapsing,
  TestCommandShowColumn,
  TestDirection,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
