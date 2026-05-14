import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBase from './test-form-sheet-base-ios';
import TestFormSheetGrabberVisible from './test-form-sheet-grabber-visible-ios';
import TestFormSheetPreferredCornerRadius from './test-form-sheet-preferred-corner-radius-ios';

const scenarios = {
  TestFormSheetBase,
  TestFormSheetGrabberVisible,
  TestFormSheetPreferredCornerRadius,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for FormSheets',
  scenarios,
};

export default FormSheetScenarioGroup;
