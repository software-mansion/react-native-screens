import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Fade Presets (Android)',
  key: 'test-stack-animation-fade-android',
  details:
    'Test the fade presets on Android: fade crossfades both screens ' +
    'symmetrically, while fadeFromBottom and fadeFromTop move and fade one ' +
    'screen and pop over less time than they push',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
