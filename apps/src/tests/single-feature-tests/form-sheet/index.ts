import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBase from './test-form-sheet-base-ios';

const scenarios = {
  TestFormSheetBase,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for FormSheets',
  scenarios,
};

export default FormSheetScenarioGroup;
