import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Layout Direction',
  key: 'test-stack-layout-direction',
  details:
    'Tests how the stack header and navigation handle system, React Native, and StackHost layout direction.',
  platforms: ['android'], // TODO: add iOS
  e2eCoverage: 'tbd',
  smokeTest: false,
};
