import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestStackV4Orientation from './stack-v4-orientation';
import TestStackV4HeaderItemVisibilityPriorityIOS from './stack-v4-header-item-visibility-priority-ios';

export { default as TestStackV4Orientation } from './stack-v4-orientation';
export { default as TestStackV4HeaderItemVisibilityPriorityIOS } from './stack-v4-header-item-visibility-priority-ios';

const scenarios = {
  TestStackV4Orientation,
  TestStackV4HeaderItemVisibilityPriorityIOS,
};

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
