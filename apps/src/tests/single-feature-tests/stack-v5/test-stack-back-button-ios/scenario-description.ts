import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Button (iOS)',
  key: 'test-stack-back-button-ios',
  details: 'Tests back button configuration and layout with respect to changing widths of elements in header. Back button props are configured on the screen that renders the back button, but the native configuration is performed on the screen below.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
