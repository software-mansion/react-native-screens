import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack lifecycle events',
  key: 'test-stack-lifecycle-events',
  details:
    'Verify lifecycle events (onWillAppear, etc.) fire on stack navigation',
  platforms: ['android', 'ios'],
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
    "iOS: all steps are automated. Android: only the Pop-button-driven push/pop path is automated (Baseline, Push - Home → A, Pop via Pop button - A → Home, Nested stack - push, Nested stack - inner push - NestedHome → NestedA, Nested stack - inner pop via Pop button - NestedA → NestedHome, and Nested stack - pop to Home via Pop button - NestedStack → Home). Manual only on Android: every pop via the native header back button, the edge-swipe / system gesture-back, and the outer-back boundary case (Pop via header back button - A → Home, Pop via native back gesture / system back - A → Home, Nested stack - inner pop via header back button and via native gesture, Nested stack - pop to Home via native gesture and via NestedStack header back button, and Nested stack - pop from NestedA via the outer NestedStack back button). Event order is manual on both platforms and in every step: the automated run matches toasts by message and ignores the <n>. prefix, so it asserts only that the expected set fired, neither the interleaving between screens nor each screen's own onWill* → onDid* order.",
  smokeTest: true,
};
