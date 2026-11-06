import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSavStackSavBelowHeaderSavInStackIOS from './test-sav-stack-sav-below-header-sav-in-stack-ios';
import TestSavMode from './test-sav-mode';

export { default as TestSavStackSavBelowHeaderSavInStackIOS } from './test-sav-stack-sav-below-header-sav-in-stack-ios';
export { default as TestSavMode } from './test-sav-mode';

const scenarios = {
  TestSavStackSavBelowHeaderSavInStackIOS,
  TestSavMode,
};

const SavScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'SafeAreaView Integration Tests',
  details: 'Integration tests for SafeAreaView with other components',
  scenarios,
};

export default SavScenarioGroup;
