import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestContainedModalComprehensive from './test-contained-modal-comprehensive-ios';
import TestContainedModalLifecycleEvents from './test-contained-modal-lifecycle-events-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestContainedModalComprehensive } from './test-contained-modal-comprehensive-ios';
export { default as TestContainedModalLifecycleEvents } from './test-contained-modal-lifecycle-events-ios';

const scenarios = {
  TestContainedModalComprehensive,
  TestContainedModalLifecycleEvents,
};

const ContainedModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ContainedModal',
  details: 'Single feature tests for ContainedModal',
  scenarios,
};

export default ContainedModalScenarioGroup;
