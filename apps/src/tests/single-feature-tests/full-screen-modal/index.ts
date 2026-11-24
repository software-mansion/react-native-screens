import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestFullScreenModalBase from './test-full-screen-modal-base-ios';
import TestFullScreenModalStackLifecycle from './test-full-screen-modal-stack-lifecycle-ios';
import TestFullScreenModalStacking from './test-full-screen-modal-stacking-ios';
import TestFullScreenModalAnimation from './test-full-screen-modal-animation-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestFullScreenModalBase } from './test-full-screen-modal-base-ios';
export { default as TestFullScreenModalStackLifecycle } from './test-full-screen-modal-stack-lifecycle-ios';
export { default as TestFullScreenModalStacking } from './test-full-screen-modal-stacking-ios';
export { default as TestFullScreenModalAnimation } from './test-full-screen-modal-animation-ios';

const scenarios = {
  TestFullScreenModalBase,
  TestFullScreenModalStackLifecycle,
  TestFullScreenModalStacking,
  TestFullScreenModalAnimation,
};

const FullScreenModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'FullScreenModal',
  details: 'Single feature tests for FullScreenModal',
  scenarios,
};

export default FullScreenModalScenarioGroup;
