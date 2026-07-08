import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestFormSheetBase from './test-form-sheet-base';
import TestFormSheetDismissEvents from './test-form-sheet-dismiss-events-ios';
import TestFormSheetExpandScrollView from './test-form-sheet-expand-scroll-view-ios';
import TestFormSheetFitToContents from './test-form-sheet-fit-to-contents';
import TestFormSheetGrabberVisible from './test-form-sheet-grabber-visible';
import TestFormSheetInitialDetentIndex from './test-form-sheet-initial-detent-index-ios';
import TestFormSheetLargestUndimmedDetentIndex from './test-form-sheet-largest-undimmed-detent-index-ios';
import TestFormSheetLifecycleEvents from './test-form-sheet-lifecycle-events';
import TestFormSheetNativeContainerStyle from './test-form-sheet-native-container-style-ios';
import TestFormSheetOnDetentChanged from './test-form-sheet-on-detent-changed';
import TestFormSheetPreferredCornerRadius from './test-form-sheet-preferred-corner-radius-ios';
import TestFormSheetPresentationState from './test-form-sheet-presentation-state';
import TestFormSheetPreventNativeDismiss from './test-form-sheet-prevent-native-dismiss-ios';
import TestFormSheetStacking from './test-form-sheet-stacking-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestFormSheetBase } from './test-form-sheet-base';
export { default as TestFormSheetDismissEvents } from './test-form-sheet-dismiss-events-ios';
export { default as TestFormSheetExpandScrollView } from './test-form-sheet-expand-scroll-view-ios';
export { default as TestFormSheetFitToContents } from './test-form-sheet-fit-to-contents';
export { default as TestFormSheetGrabberVisible } from './test-form-sheet-grabber-visible';
export { default as TestFormSheetInitialDetentIndex } from './test-form-sheet-initial-detent-index-ios';
export { default as TestFormSheetLargestUndimmedDetentIndex } from './test-form-sheet-largest-undimmed-detent-index-ios';
export { default as TestFormSheetLifecycleEvents } from './test-form-sheet-lifecycle-events';
export { default as TestFormSheetNativeContainerStyle } from './test-form-sheet-native-container-style-ios';
export { default as TestFormSheetOnDetentChanged } from './test-form-sheet-on-detent-changed';
export { default as TestFormSheetPreferredCornerRadius } from './test-form-sheet-preferred-corner-radius-ios';
export { default as TestFormSheetPresentationState } from './test-form-sheet-presentation-state';
export { default as TestFormSheetPreventNativeDismiss } from './test-form-sheet-prevent-native-dismiss-ios';
export { default as TestFormSheetStacking } from './test-form-sheet-stacking-ios';

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
