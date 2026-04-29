import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBasic from './test-form-sheet-base';

const scenarios = {
  TestFormSheetBasic,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for FormSheets',
  scenarios,
};

export default FormSheetScenarioGroup;
