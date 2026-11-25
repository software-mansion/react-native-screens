import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Operations',
  key: 'test-stack-animation-operations',
  details:
    'Test which animation plays for a multi-push, a multi-pop, a ' +
    'replace and a multi-replace, and on Android what happens when an ' +
    'operation interrupts a running transition',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 18.6', 'iOS 27.2'], testOn: ['iOS 27.2'] },
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    iphone:
      'System animations on (Settings → Accessibility → Motion → Reduce Motion is off).',
    'android-phone':
      'System animations on (Settings → Accessibility → Color and motion → Remove animations is off).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, and whether an intermediate screen flashes are not assertable with Detox; only the resulting stack would be.',
  smokeTest: false,
};
