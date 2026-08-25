import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lift on scroll (Android)',
  key: 'test-stack-lift-on-scroll-android',
  details: 'Verify the Android header lift-on-scroll effect.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
