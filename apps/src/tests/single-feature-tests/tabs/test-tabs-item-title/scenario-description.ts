import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Title',
  key: 'test-tabs-item-title',
  details:
    'Exercises tab bar item title props: title, font color, font family, font size (small/large on' +
    ' Android, single size on iOS), font style, font weight, and (iOS only)' +
    ' position adjustment and tint override.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
