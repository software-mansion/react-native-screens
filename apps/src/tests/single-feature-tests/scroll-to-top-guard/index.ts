import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestScrollToTopGuardHeaderSubviewsIOS from './test-scroll-to-top-guard-header-subviews-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestScrollToTopGuardHeaderSubviewsIOS } from './test-scroll-to-top-guard-header-subviews-ios';

const scenarios = {
  TestScrollToTopGuardHeaderSubviewsIOS,
};

const ScrollToTopGuardScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Scroll to Top Guard',
  details: 'Single feature tests for the ScrollToTopGuard component',
  scenarios,
};

export default ScrollToTopGuardScenarioGroup;
