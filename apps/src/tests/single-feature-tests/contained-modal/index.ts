import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestContainedModalBase from './test-contained-modal-base-ios';

const scenarios = {
  TestContainedModalBase,
};

const ContainedModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ContainedModal',
  details: 'Single feature tests for ContainedModals',
  scenarios,
};

export default ContainedModalScenarioGroup;
