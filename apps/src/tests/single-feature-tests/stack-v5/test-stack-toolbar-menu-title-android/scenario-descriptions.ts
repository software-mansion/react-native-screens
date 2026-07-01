import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Title',
  key: 'test-stack-toolbar-menu-title-android',
  details:
    'Tests the title-related toolbar menu item props: title, titleCondensed ' +
    '(toolbar button label) and tooltipText (long-press tooltip).',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
