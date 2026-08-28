import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestFormSheetBase from './test-form-sheet-base';
import TestFormSheetFitToContents from './test-form-sheet-fit-to-contents';
import TestFormSheetInitialDetentIndex from './test-form-sheet-initial-detent-index';
import TestFormSheetOnDetentChanged from './test-form-sheet-on-detent-changed';
import TestFormSheetLargestUndimmedDetentIndex from './test-form-sheet-largest-undimmed-detent-index-ios';
import TestFormSheetExpandScrollView from './test-form-sheet-expand-scroll-view-ios';
import TestFormSheetGrabberVisible from './test-form-sheet-grabber-visible';
import TestFormSheetPreferredCornerRadius from './test-form-sheet-preferred-corner-radius';
import TestFormSheetNativeContainerStyle from './test-form-sheet-native-container-style';
import TestFormSheetPreventNativeDismiss from './test-form-sheet-prevent-native-dismiss';
import TestFormSheetLifecycleEvents from './test-form-sheet-lifecycle-events';
import TestFormSheetDismissEvents from './test-form-sheet-dismiss-events';
import TestFormSheetPresentationState from './test-form-sheet-presentation-state';
import TestFormSheetStacking from './test-form-sheet-stacking';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestFormSheetBase } from './test-form-sheet-base';
export { default as TestFormSheetFitToContents } from './test-form-sheet-fit-to-contents';
export { default as TestFormSheetInitialDetentIndex } from './test-form-sheet-initial-detent-index';
export { default as TestFormSheetOnDetentChanged } from './test-form-sheet-on-detent-changed';
export { default as TestFormSheetLargestUndimmedDetentIndex } from './test-form-sheet-largest-undimmed-detent-index-ios';
export { default as TestFormSheetExpandScrollView } from './test-form-sheet-expand-scroll-view-ios';
export { default as TestFormSheetGrabberVisible } from './test-form-sheet-grabber-visible';
export { default as TestFormSheetPreferredCornerRadius } from './test-form-sheet-preferred-corner-radius';
export { default as TestFormSheetNativeContainerStyle } from './test-form-sheet-native-container-style';
export { default as TestFormSheetPreventNativeDismiss } from './test-form-sheet-prevent-native-dismiss';
export { default as TestFormSheetLifecycleEvents } from './test-form-sheet-lifecycle-events';
export { default as TestFormSheetDismissEvents } from './test-form-sheet-dismiss-events';
export { default as TestFormSheetPresentationState } from './test-form-sheet-presentation-state';
export { default as TestFormSheetStacking } from './test-form-sheet-stacking';

const scenarios = {
  TestFormSheetBase,
  TestFormSheetFitToContents,
  TestFormSheetInitialDetentIndex,
  TestFormSheetOnDetentChanged,
  TestFormSheetLargestUndimmedDetentIndex,
  TestFormSheetExpandScrollView,
  TestFormSheetGrabberVisible,
  TestFormSheetPreferredCornerRadius,
  TestFormSheetNativeContainerStyle,
  TestFormSheetPreventNativeDismiss,
  TestFormSheetLifecycleEvents,
  TestFormSheetDismissEvents,
  TestFormSheetPresentationState,
  TestFormSheetStacking,
};

const FormSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FormSheet',
  details: 'Single feature tests for the standalone FormSheet component',
  scenarios,
};

export default FormSheetScenarioGroup;
