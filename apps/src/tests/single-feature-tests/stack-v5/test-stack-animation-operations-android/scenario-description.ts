import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Operations (Android)',
  key: 'test-stack-animation-operations-android',
  details:
    'Test which animation plays for a multi-push, a multi-pop, a ' +
    'replace and a multi-replace, and what happens when an operation ' +
    'interrupts a running transition',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    'android-phone':
      'System animations on (Settings → Accessibility → Color and motion → Remove animations is off). For **Interrupted operations (with extended animation duration scale)** only: in Developer options set "Animator duration scale" and "Transition animation scale" to 5x before step 1 of that group and back to 1x after its step 5.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. Which screen moves, in which direction, and whether an intermediate screen flashes are not assertable with Detox; only the resulting stack would be.',
  smokeTest: false,
};
