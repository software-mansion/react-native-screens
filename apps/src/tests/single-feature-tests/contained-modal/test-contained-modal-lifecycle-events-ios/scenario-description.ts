import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lifecycle Events',
  key: 'test-contained-modal-lifecycle-events-ios',
  details:
    'Lifecycle and rejection events of a contained modal across presentation, dismissal, stack push/pop suspension, and an immediate same-provider rejection in both the over-content and replacing-content variants.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
