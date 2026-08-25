import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Scroll to Top Guard Header Subviews (iOS)',
  key: 'test-scroll-to-top-guard-header-subviews-ios',
  details:
    'Wraps Stack v5 header left/right/title subviews in <ScrollToTopGuard> to prevent the ' +
    'iPadOS 26+ / iPhone iOS 27+ tap-to-scroll-to-top. Per-subview: guard on/off, hitSlop.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
