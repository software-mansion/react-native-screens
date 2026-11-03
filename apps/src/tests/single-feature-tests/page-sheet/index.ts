import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestPageSheetBase from './test-page-sheet-base';
import TestPageSheetFitToContents from './test-page-sheet-fit-to-contents';
import TestPageSheetIPadLayout from './test-page-sheet-ipad-layout-ios';
import TestPageSheetPresentationState from './test-page-sheet-presentation-state';
import TestPageSheetStacking from './test-page-sheet-stacking';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestPageSheetBase } from './test-page-sheet-base';
export { default as TestPageSheetFitToContents } from './test-page-sheet-fit-to-contents';
export { default as TestPageSheetIPadLayout } from './test-page-sheet-ipad-layout-ios';
export { default as TestPageSheetPresentationState } from './test-page-sheet-presentation-state';
export { default as TestPageSheetStacking } from './test-page-sheet-stacking';

const scenarios = {
  TestPageSheetBase,
  TestPageSheetFitToContents,
  TestPageSheetIPadLayout,
  TestPageSheetPresentationState,
  TestPageSheetStacking,
};

const PageSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'PageSheet',
  details: 'Single feature tests for PageSheet',
  scenarios,
};

export default PageSheetScenarioGroup;
