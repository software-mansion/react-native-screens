import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Replace (Android)',
  key: 'test-stack-animation-replace-android',
  details:
    "Test the `replaceAnimation` prop: a replace plays the outgoing screen's " +
    "pop animation with `pop` and the incoming screen's push animation " +
    'with `push`, and the predictive back gesture after a replace',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
