import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon',
  key: 'test-tabs-item-icon',
  details:
    'Exercises tab bar item icon props: iOS icon types (sfSymbol, imageSource' +
    ' incl. asset catalog images) with tabBarItemIconColor overrides; Android' +
    ' tabBarItemIconColor in normal, selected and focused states.',
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
    'android-phone':
      'Portrait orientation; it is the primary verification surface (stacked layout).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. All observable outcomes are purely visual (icon color, selected vs. unselected glyph). Detox does not expose tint color or rendered image attributes of native tab bar items, so automated assertion is not feasible.',
  smokeTest: false,
};
