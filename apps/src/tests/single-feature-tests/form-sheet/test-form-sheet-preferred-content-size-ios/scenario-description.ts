import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Preferred Content Size (iOS)',
  key: 'test-form-sheet-preferred-content-size-ios',
  details:
    'preferredContentSize sizes the iPad FormSheet panel; widthFollowsPreferredContentSizeWhenEdgeAttached applies its width to the edge-attached sheet.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
