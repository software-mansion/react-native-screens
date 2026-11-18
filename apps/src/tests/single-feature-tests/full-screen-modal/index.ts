import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestFullScreenModalBase from './test-full-screen-modal-base-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestFullScreenModalBase } from './test-full-screen-modal-base-ios';

const scenarios = {
  TestFullScreenModalBase,
};

const FullScreenModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FullScreenModal',
  details: 'Single feature tests for FullScreenModal',
  scenarios,
};

export default FullScreenModalScenarioGroup;
