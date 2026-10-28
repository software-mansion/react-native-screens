import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Options (Android)',
  key: 'test-stack-animation-options-android',
  details:
    'Test the duration, easing and distance options of an animation preset ' +
    'on Android, and the fallback to default for an invalid value',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
