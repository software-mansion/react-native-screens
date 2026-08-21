import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Color Scheme',
  key: 'test-stack-color-scheme',
  details:
    'Tests how the stack handles system, React Native, StackHost, and header config color schemes.',
  platforms: ['android'], // TODO: add iOS
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
