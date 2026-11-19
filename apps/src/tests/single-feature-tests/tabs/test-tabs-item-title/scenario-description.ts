import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Title',
  key: 'test-tabs-item-title',
  details:
    'Exercises tab bar item title props: title, font color, font family, font size (small/large on' +
    ' Android, single size on iOS), font style, font weight, and (iOS only)' +
    ' position adjustment and tint override.',
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
    'Not automated. All observable outcomes are purely visual (color, typography, pixel position of a label). Detox does not expose color or font attributes of native tab bar items, so automated assertion is not feasible.',
  smokeTest: false,
};
