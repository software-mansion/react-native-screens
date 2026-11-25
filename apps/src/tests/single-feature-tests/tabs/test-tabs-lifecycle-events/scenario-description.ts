import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tabs lifecycle events',
  key: 'test-tabs-lifecycle-events',
  details: 'Verify lifecycle events (onWillAppear, etc.) fire on tab switch',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'The E2E test covers all steps of Baseline, Tab A → Tab B transition, Tab B → Tab C transition and Tab C → Tab A transition on both iPhone and Android, verifying baseline appearance events and all three tab-switch transitions. On both platforms toasts are matched by message only, so the automated run asserts just the event set. The re-tap (Re-tapping the active tab (edge case) step 1) is covered only on Android, as on iOS 26+ Detox is not able to re-tap a tab bar item. Not automated: event order in every step - neither the interleaving between tabs nor each tab\'s own onWill* → onDid* order (matching by message ignores the numeric toast prefix, so every "before" check in the steps is a manual one); rapid switching (Rapid tab switching (edge case) step 1), which cannot be reliably triggered through Detox\'s synchronous interaction model; and the full 12-toast sequence (Full round-trip verification step 1), which is too fragile due to shifting toast indices on each dismiss.',
  smokeTest: false,
};
