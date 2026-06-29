import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestContainedModalBase from './test-contained-modal-base-ios';
import TestContainedModalPresentationStyle from './test-contained-modal-presentation-style-ios';

const scenarios = {
  TestContainedModalBase,
  TestContainedModalPresentationStyle,
};

const ContainedModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ContainedModal',
  details: 'Single feature tests for ContainedModals',
  scenarios,
};

export default ContainedModalScenarioGroup;
