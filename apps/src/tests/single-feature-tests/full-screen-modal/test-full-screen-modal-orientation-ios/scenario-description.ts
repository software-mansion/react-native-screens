import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Orientation',
  key: 'test-full-screen-modal-orientation-ios',
  details:
    'The `orientation` prop of both FullScreenModal variants: a landscape-only modal rotates the screen on open, `inherit` follows the app setting, and the presenter rotates freely again after close.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
