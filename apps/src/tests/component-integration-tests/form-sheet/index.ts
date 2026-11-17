import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetScrollView from './test-form-sheet-scrollview-nesting-scrollview-in-form-sheet';
import TestFormSheetWithNestedStackV5 from './test-form-sheet-stack-v5-nesting-stack-v5-in-form-sheet-ios';
import TestFormSheetPageSheetMixedStacking from './test-form-sheet-page-sheet-mixed-stacking';

export { default as TestFormSheetScrollView } from './test-form-sheet-scrollview-nesting-scrollview-in-form-sheet';
export { default as TestFormSheetWithNestedStackV5 } from './test-form-sheet-stack-v5-nesting-stack-v5-in-form-sheet-ios';
export { default as TestFormSheetPageSheetMixedStacking } from './test-form-sheet-page-sheet-mixed-stacking';

const scenarios = {
  TestFormSheetScrollView,
  TestFormSheetWithNestedStackV5,
  TestFormSheetPageSheetMixedStacking,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet Integration Tests',
  details: 'Test interaction between FormSheet and different components',
  scenarios,
};

export default FormSheetScenarioGroup;
