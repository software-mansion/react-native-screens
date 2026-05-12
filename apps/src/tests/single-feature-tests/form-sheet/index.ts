import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestFormSheetBase from './test-form-sheet-base-ios';
import TestFormSheetDismissEvents from './test-form-sheet-dismiss-events-ios';
import TestFormSheetExpandScrollView from './test-form-sheet-expand-scroll-view-ios';
import TestFormSheetFitToContents from './test-form-sheet-fit-to-contents-ios';
import TestFormSheetGrabberVisible from './test-form-sheet-grabber-visible-ios';
import TestFormSheetInitialDetentIndex from './test-form-sheet-initial-detent-index-ios';
import TestFormSheetLargestUndimmedDetentIndex from './test-form-sheet-largest-undimmed-detent-index-ios';
import TestFormSheetLifecycleEvents from './test-form-sheet-lifecycle-events-ios';
import TestFormSheetNativeContainerStyle from './test-form-sheet-native-container-style-ios';
import TestFormSheetOnDetentChanged from './test-form-sheet-on-detent-changed-ios';
import TestFormSheetPreferredCornerRadius from './test-form-sheet-preferred-corner-radius-ios';
import TestFormSheetPresentationState from './test-form-sheet-presentation-state-ios';
import TestFormSheetPreventNativeDismiss from './test-form-sheet-prevent-native-dismiss-ios';
import TestFormSheetStacking from './test-form-sheet-stacking-ios';

const scenarios = {
  TestFormSheetBase,
  TestFormSheetDismissEvents,
  TestFormSheetExpandScrollView,
  TestFormSheetFitToContents,
  TestFormSheetGrabberVisible,
  TestFormSheetInitialDetentIndex,
  TestFormSheetLargestUndimmedDetentIndex,
  TestFormSheetLifecycleEvents,
  TestFormSheetNativeContainerStyle,
  TestFormSheetOnDetentChanged,
  TestFormSheetPreferredCornerRadius,
  TestFormSheetPresentationState,
  TestFormSheetPreventNativeDismiss,
  TestFormSheetStacking,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for FormSheets',
  scenarios,
};

export default FormSheetScenarioGroup;
