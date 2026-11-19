import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab-Specific Appearance',
  key: 'test-tabs-appearance-defined-by-selected-tab',
  details:
    'Verifies that the tab bar dynamically updates to reflect the styling of the selected tab.',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  deviceSetup: {
    iphone:
      'Portrait orientation; it is the primary verification surface (stacked layout).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. All observable outcomes are purely visual - native tab bar background color, item icon and title colors, active indicator color, badge color, and blur effect. Detox does not expose color or typography attributes of native tab bar views on either platform, making automated assertion infeasible.',
  smokeTest: true,
};
