import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Slide Presets',
  key: 'test-stack-animation-slide',
  details:
    'Test the slide presets: the horizontal ones move both screens, the ' +
    'vertical ones move only one, on Android in RTL only the trailing and ' +
    'leading ones mirror, and on iOS the header back button and menu pop ' +
    'with the preset',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
