import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory Visibility',
  key: 'test-tabs-bottom-accessory-visibility-ios',
  details:
    'Test bottom accessory visibility toggling via bottomAccessory and hidden props.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
