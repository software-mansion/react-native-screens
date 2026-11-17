import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory Size',
  key: 'test-tabs-bottom-accessory-size-ios',
  details:
    'Test that the bottom accessory takes the full available width on iPad ' +
    'after the sidebar is toggled or the device is rotated, and on iPhone Duo ' +
    'after fold, rotation and tab bar minimize changes, also when the ' +
    'accessory is hidden or removed during the change.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
