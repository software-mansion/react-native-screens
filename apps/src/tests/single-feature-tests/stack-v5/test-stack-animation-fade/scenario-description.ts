import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Fade Presets',
  key: 'test-stack-animation-fade',
  details:
    'Test the fade presets: fade crossfades both screens symmetrically on ' +
    'Android and iOS, while on Android fadeFromBottom and fadeFromTop move ' +
    'and fade one screen and pop over less time than they push',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
