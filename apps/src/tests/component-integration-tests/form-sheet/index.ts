import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetWithNestedStackV5 from './test-stack-v5-in-form-sheet-ios';

const scenarios = { TestFormSheetWithNestedStackV5 };

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet Integration Tests',
  details: 'Test interaction between FormSheet and different components',
  scenarios,
};

export default FormSheetScenarioGroup;
