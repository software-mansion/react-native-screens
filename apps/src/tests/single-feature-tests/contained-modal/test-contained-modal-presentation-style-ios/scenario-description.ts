import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Presentation style',
  key: 'test-contained-modal-presentation-style-ios',
  details:
    "Allows to test the ContainedModal's `transparent` prop (over-current-context vs current-context presentation).",
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
