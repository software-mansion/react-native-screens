import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestInlineModalBase from './test-inline-modal-base';

const scenarios = {
  TestInlineModalBase,
};

const InlineModalScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'InlineModal',
  details: 'Single feature tests for OverCurrentContext presentation',
  scenarios,
};

export default InlineModalScenarioGroup;
