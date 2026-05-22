import { ScenarioDescription } from "@apps/tests/shared/helpers";

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Layout Appearances (iOS)',
  key: 'test-tabs-layout-appearances-ios',
  details:
    'Verifies tab item font styles and colors across all layout appearances. Visual changes are used to confirm responsive layout shifts during device rotation.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};

export default scenarioDescription;
