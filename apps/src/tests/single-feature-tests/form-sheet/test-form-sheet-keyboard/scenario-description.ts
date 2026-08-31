import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Keyboard Integration',
  key: 'test-form-sheet-keyboard',
  details:
    'Text inputs inside a two-detent sheet and a fitToContents sheet: keyboard show / hide, focused input visibility, dismissal with the keyboard shown.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
