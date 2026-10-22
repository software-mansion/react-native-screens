import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Keyboard Integration',
  key: 'test-form-sheet-keyboard',
  details:
    'Text inputs inside sheets with 1, 2, 3 detents and fitToContents: keyboard show / hide, focused input visibility, dismissal with the keyboard shown.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
