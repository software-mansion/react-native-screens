import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBasic from './test-form-sheet-basic';

const scenarios = {
  TestFormSheetBasic,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for form-sheets',
  scenarios,
};

export default FormSheetScenarioGroup;
