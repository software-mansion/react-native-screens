import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Title (iOS)',
  key: 'test-tabs-item-title-ios',
  details:
    'Exercises every iOS tab bar item title prop: title, font color,' +
    ' font family, size, style, weight, and position adjustment.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};

export default scenarioDescription;
