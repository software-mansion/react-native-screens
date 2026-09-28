import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestStackV4Orientation from './stack-v4-orientation';
import TestStackV4HeaderBarMinimizationIOS from './stack-v4-header-bar-minimization-ios';
import TestStackV4HeaderBarSafeAreaAdjustmentIOS from './stack-v4-header-bar-safe-area-adjustment-ios';

export { default as TestStackV4Orientation } from './stack-v4-orientation';
export { default as TestStackV4HeaderBarMinimizationIOS } from './stack-v4-header-bar-minimization-ios';
export { default as TestStackV4HeaderBarSafeAreaAdjustmentIOS } from './stack-v4-header-bar-safe-area-adjustment-ios';

const scenarios = {
  TestStackV4Orientation,
  TestStackV4HeaderBarMinimizationIOS,
  TestStackV4HeaderBarSafeAreaAdjustmentIOS,
};

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
