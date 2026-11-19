import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Identifier (iOS)',
  key: 'test-stack-header-item-identifier-ios',
  details:
    'Three screens each hold the same three header items (shared `identifier`) ' +
    'ordered differently and with different icons across screens. On iOS 26+ matched items animate ' +
    'between positions instead of cross-fading. Not supported on iOS 18 and below.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26'], testOn: ['iOS 26'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers the end state after each push, not the transitions. Automated: steps 1–3 of Steps - iPhone (sfSymbols): which item shows at which trailing position (asserted via horizontal frame order), and that each expected symbol is visible (on iOS 26) or exists (on iOS 27) with no other symbol present; on iOS 26 only, steps 1–2 of Steps with separators: the same symbol and position checks, plus that each item sits in its own platter view (`_UINavigationBarPlatterView`). Not automated (any iOS version): transition quality (steps 2–4 of Steps - iPhone, step 2 of Steps with separators), i.e. flashing / blur / crossfade, because Detox samples settled state, not animation frames; step 4 of Steps - iPhone (custom views), because automating it would only check that the custom views render, not the real identifier-matching functionality; step 5 of Steps - iPhone (identifiers off), because the end state is identical and only the transition differs. On iOS 27, steps 1–2 of Steps with separators are skipped.',
  smokeTest: false,
};
