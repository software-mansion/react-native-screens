import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Operations (Android)',
  key: 'test-stack-animation-operations-android',
  details:
    'Test which animation plays for a multi-push, a multi-pop, a ' +
    'replace and a multi-replace, and what happens when an operation ' +
    'interrupts a running transition',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
