import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon Tint and Size',
  key: 'test-tabs-item-icon-tint-and-size',
  details:
    'Exercises custom tab bar item icons: iOS `renderingMode` on imageSource' +
    ' and sfSymbol icons, Android `tinting` on imageSource and' +
    ' drawableResource icons, per slot; Android per-tab' +
    ' `tabBarItemIconSize` and active indicator size; iOS custom SF' +
    ' Symbols from the asset catalog.',
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
    'Not automated. All observable outcomes are purely visual (icon color, icon size, active indicator size). Detox does not expose tint color, rendered image attributes or drawable bounds of native tab bar items, so automated assertion is not feasible.',
  smokeTest: false,
};
