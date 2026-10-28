import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Replacing Content',
  key: 'test-contained-modal-replacing-content-ios',
  details:
    'ContainedModalReplacingContent specifics: provider children leave the screen while open and return intact, restore geometry after a resize or rotation performed while open, repeated open/close cycles, touch delivery inside the modal.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
