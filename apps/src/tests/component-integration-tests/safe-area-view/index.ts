import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSavStackSavBelowHeaderSavInStackIOS from './test-sav-stack-sav-below-header-sav-in-stack-ios';

export { default as TestSavStackSavBelowHeaderSavInStackIOS } from './test-sav-stack-sav-below-header-sav-in-stack-ios';

const scenarios = {
  TestSavStackSavBelowHeaderSavInStackIOS,
};

const SavScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'SafeAreaView Integration Tests',
  details: 'Integration tests for SafeAreaView with other components',
  scenarios,
};

export default SavScenarioGroup;
