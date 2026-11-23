import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Operations',
  key: 'test-stack-animation-operations',
  details:
    'Test which animation plays for a multi-push, a multi-pop, a ' +
    'replace and a multi-replace, and on Android what happens when an ' +
    'operation interrupts a running transition',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
