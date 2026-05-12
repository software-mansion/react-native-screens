import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBase from './test-form-sheet-base-ios';
import TestFormSheetGrabberVisible from './test-form-sheet-grabber-visible-ios';
import TestFormSheetInitialDetentIndex from './test-form-sheet-initial-detent-index-ios';
import TestFormSheetLargestUndimmedDetentIndex from './test-form-sheet-largest-undimmed-detent-index-ios';
import TestFormSheetPreferredCornerRadius from './test-form-sheet-preferred-corner-radius-ios';
import TestFormSheetStacking from './test-form-sheet-stacking-ios';

const scenarios = {
  TestFormSheetBase,
  TestFormSheetGrabberVisible,
  TestFormSheetInitialDetentIndex,
  TestFormSheetLargestUndimmedDetentIndex,
  TestFormSheetPreferredCornerRadius,
  TestFormSheetStacking,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for FormSheets',
  scenarios,
};

export default FormSheetScenarioGroup;
