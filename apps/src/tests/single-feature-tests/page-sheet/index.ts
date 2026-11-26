import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestPageSheetBase from './test-page-sheet-base';
import TestPageSheetEdgeAttachedCompactHeight from './test-page-sheet-edge-attached-compact-height-ios';
import TestPageSheetFitToContents from './test-page-sheet-fit-to-contents';
import TestPageSheetIPadLayout from './test-page-sheet-ipad-layout-ios';
import TestPageSheetPresentationState from './test-page-sheet-presentation-state';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestPageSheetBase } from './test-page-sheet-base';
export { default as TestPageSheetEdgeAttachedCompactHeight } from './test-page-sheet-edge-attached-compact-height-ios';
export { default as TestPageSheetFitToContents } from './test-page-sheet-fit-to-contents';
export { default as TestPageSheetIPadLayout } from './test-page-sheet-ipad-layout-ios';
export { default as TestPageSheetPresentationState } from './test-page-sheet-presentation-state';

const scenarios = {
  TestPageSheetBase,
  TestPageSheetEdgeAttachedCompactHeight,
  TestPageSheetFitToContents,
  TestPageSheetIPadLayout,
  TestPageSheetPresentationState,
};

const PageSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'PageSheet',
  details: 'Single feature tests for PageSheet',
  scenarios,
};

export default PageSheetScenarioGroup;
