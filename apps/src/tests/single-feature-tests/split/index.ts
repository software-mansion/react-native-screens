import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSplitTopColumnForCollapsing from './test-top-column-for-collapsing';
import TestSplitCommandShowColumn from './test-command-show-column';
import TestSplitColorScheme from './test-split-color-scheme-ios';
import TestSplitPressables from './test-split-pressables-ios';
import TestSplitColumnVisibility from './test-split-column-visibility-ios';
import TestSplitStackHeaderNavigation from './test-split-stack-header-navigation-ios';
import TestSplitStackAppearanceEvents from './test-split-stack-appearance-events-ios';
import TestSplitStackContentSwap from './test-split-stack-content-swap-ios';
import TestSplitStackIntegrationDisabled from './test-split-stack-integration-disabled-ios';

export { default as TestSplitTopColumnForCollapsing } from './test-top-column-for-collapsing';
export { default as TestSplitCommandShowColumn } from './test-command-show-column';
export { default as TestSplitColorScheme } from './test-split-color-scheme-ios';
export { default as TestSplitPressables } from './test-split-pressables-ios';
export { default as TestSplitColumnVisibility } from './test-split-column-visibility-ios';
export { default as TestSplitStackHeaderNavigation } from './test-split-stack-header-navigation-ios';
export { default as TestSplitStackAppearanceEvents } from './test-split-stack-appearance-events-ios';
export { default as TestSplitStackContentSwap } from './test-split-stack-content-swap-ios';
export { default as TestSplitStackIntegrationDisabled } from './test-split-stack-integration-disabled-ios';

const scenarios = {
  TestSplitTopColumnForCollapsing,
  TestSplitCommandShowColumn,
  TestSplitColorScheme,
  TestSplitPressables,
  TestSplitColumnVisibility,
  TestSplitStackHeaderNavigation,
  TestSplitStackAppearanceEvents,
  TestSplitStackContentSwap,
  TestSplitStackIntegrationDisabled,
};

const SplitScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Split',
  details: 'Single feature tests for Split',
  scenarios,
};

export default SplitScenarioGroup;
