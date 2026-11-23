import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Replace',
  key: 'test-stack-animation-replace',
  details:
    "Test the `replaceAnimation` prop: a replace plays the outgoing screen's " +
    "pop animation with `pop` and the incoming screen's push animation " +
    'with `push`, and the back gesture after a replace',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
