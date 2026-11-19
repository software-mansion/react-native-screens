import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory Visibility',
  key: 'test-tabs-bottom-accessory-visibility-ios',
  details:
    'Test bottom accessory visibility toggling via bottomAccessory ' +
    'and bottomAccessoryHidden props.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 26.0'],
      testOn: ['iOS 26.0'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers the end state of all steps on iPhone - the accessory is present with its content (and the tab bar laid out below it) or absent after each hidden / rendered toggle. Not automated: animation quality - smooth slide out/in with content visible and no blank frame (all steps of Hidden prop, Rendered prop step 1 and Combined step 3).',
  smokeTest: false,
};
