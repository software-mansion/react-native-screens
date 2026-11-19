import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Selective Updates (iOS)',
  key: 'test-stack-header-selective-updates-ios',
  details:
    'Tests that header item updates are scoped — only the changed item rebuilds. On iOS 26+, item rebuild causes a visible flash/blur on the affected bar button.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'The E2E test covers all steps, but not in full scope. It asserts the observable state changes — header titles, attached menus, selection checkmarks/toasts, custom-view swaps, and item count. It cannot assert the transient iOS 26+ rebuild flash/blur (whether an affected item does or does not visually flash), which has no JS-side signal and requires manual verification on iOS 26+.',
  smokeTest: false,
};
