import { ScenarioGroup } from '../../shared/helpers';
import TestTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestCommandShowColumn from './test-command-show-column';

const SplitScenarioGroup: ScenarioGroup = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios: [TestTopColumnForCollapsing, TestCommandShowColumn],
};

export default SplitScenarioGroup;
