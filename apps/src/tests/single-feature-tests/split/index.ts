import { ScenarioGroup } from '../../shared/helpers';
import TestTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestCommandShowColumn from './test-command-show-column';

const scenarios = { TestTopColumnForCollapsing, TestCommandShowColumn };

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
