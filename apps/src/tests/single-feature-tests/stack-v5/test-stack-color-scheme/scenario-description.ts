import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Color Scheme',
  key: 'test-stack-color-scheme',
  details:
    'Tests how the stack handles system, React Native, and StackHost color schemes.',
  platforms: ['android'], // TODO: add iOS
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Detox does not have access to color attributes natively, making it impossible to reliably verify if the native header color has changed in response to a style update.',
  smokeTest: true,
};
