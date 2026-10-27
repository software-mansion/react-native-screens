import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestStackV4Orientation from './stack-v4-orientation';
import TestStackV4HeaderLetterSpacing from './stack-v4-header-letter-spacing';
import TestStackV4SheetSelectDetent from './test-stack-v4-sheet-select-detent';

export { default as TestStackV4Orientation } from './stack-v4-orientation';
export { default as TestStackV4HeaderLetterSpacing } from './stack-v4-header-letter-spacing';
export { default as TestStackV4SheetSelectDetent } from './test-stack-v4-sheet-select-detent';

const scenarios = {
  TestStackV4HeaderLetterSpacing,
  TestStackV4Orientation,
  TestStackV4SheetSelectDetent,
};

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
