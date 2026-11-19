import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Title',
  key: 'test-stack-toolbar-menu-title-android',
  details:
    'Tests the title-related toolbar menu item props: title, titleCondensed ' +
    '(toolbar button label) and tooltipText (long-press tooltip).',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers all steps of Baseline — initial render, titleCondensed on the Toolbar button (no icon), and titleCondensed with an icon depends on room (orientation), and steps 1–4 of Imperative command — set and reset. Not automated: all steps of tooltipText on a Toolbar icon button and steps 5–6 of Imperative command — set and reset (tooltipText steps).',
  smokeTest: false,
};
