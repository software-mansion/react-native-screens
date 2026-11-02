import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestPageSheetBase from './test-page-sheet-base';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestPageSheetBase } from './test-page-sheet-base';

const scenarios = {
  TestPageSheetBase,
};

const PageSheetScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'PageSheet',
  details: 'Single feature tests for PageSheet',
  scenarios,
};

export default PageSheetScenarioGroup;
