import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Controller Mode',
  key: 'test-tabs-tab-bar-controller-mode-ios',
  details: 'Test different tab bar modes.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    ipad: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'iPhone steps are fully automated, iPad partially: steps 1, 2, 4 and 7 of iPad. On iPad the E2E test verifies the initial automatic default state, tabBar mode keeping the floating tab bar visible without a sidebar toggle, and tabSidebar mode toggling the sidebar open/closed (via the "Toggle sidebar" button). Not automated: steps 3, 5 and 8 of iPad (Split View window resizing), step 6 of iPad (landscape orientation), step 9 of iPad (mode-cycling crash check) and step 10 of iPad (tab switching).',
  smokeTest: false,
};
