import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Slide Presets (Android)',
  key: 'test-stack-animation-slide-android',
  details:
    'Test the six slide presets on Android: the horizontal ones move both ' +
    'screens, the vertical ones move only one, and in RTL only the trailing ' +
    'and leading ones mirror',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
