import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Hidden',
  key: 'test-tabs-tab-bar-hidden',
  details:
    'Test tabBarHidden prop on TabsHost - toggle to show/hide the tab bar at runtime.',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'All steps of (iOS only) Hiding animation can be enabled and disabled dynamically are not covered.',
  smokeTest: false,
};
