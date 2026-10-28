import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Comprehensive',
  key: 'test-contained-modal-comprehensive-ios',
  details:
    'One stack-hosted scenario, switchable between both modal variants, covering containment, outside interactivity, scroll-present at offset, provider resize, rotation, suspend/restore via push/pop, dismiss-while-suspended, nested providers (full-screen outer modal), and counter state preservation.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
