import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lift on scroll (Android)',
  key: 'test-stack-lift-on-scroll-android',
  details: 'Verify the Android header lift-on-scroll effect.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers the lifted/unlifted transitions of all steps, plus the app bar being attached, detached and pinned. Lift is read from the app bar\'s elevation, which Material drives off the same state_lifted that paints the tonal colour. Not automated: the lift\'s appearance (the tonal/colour shift in Baseline steps 1-2), because Detox reads no colours; flicker while the elevation animates (Baseline step 1) and the "no visible header rebuild/flash" in Baseline step 3, because Detox samples state, not animation frames. Baseline step 2 asserts that the lifted state ignores scrolling, not that elevation is zero: without liftOnScroll the app bar is not liftable, so it rests at a non-zero elevation.',
  smokeTest: false,
};
