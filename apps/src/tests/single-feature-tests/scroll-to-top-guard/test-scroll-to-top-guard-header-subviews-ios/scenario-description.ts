import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Scroll to Top Guard Header Subviews (iOS)',
  key: 'test-scroll-to-top-guard-header-subviews-ios',
  details:
    'Wraps header left/right/title subviews in <ScrollToTopGuard> to prevent the iOS 26+/iPadOS 26+ tap-to-scroll-to-top. Per-subview: guard on/off, hitSlop, hidesSharedBackground (left/right).',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
