import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestFullScreenModalBase from './test-full-screen-modal-base-ios';
import TestFullScreenModalTransition from './test-full-screen-modal-transition-ios';
import TestFullScreenModalOrientation from './test-full-screen-modal-orientation-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestFullScreenModalBase } from './test-full-screen-modal-base-ios';
export { default as TestFullScreenModalTransition } from './test-full-screen-modal-transition-ios';
export { default as TestFullScreenModalOrientation } from './test-full-screen-modal-orientation-ios';

const scenarios = {
  TestFullScreenModalBase,
  TestFullScreenModalTransition,
  TestFullScreenModalOrientation,
};

const FullScreenModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FullScreenModal',
  details: 'Single feature tests for FullScreenModal',
  scenarios,
};

export default FullScreenModalScenarioGroup;
