import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory Layout',
  key: 'test-tabs-bottom-accessory-layout-ios',
  details: 'Test tabs bottom accessory layout with various contents',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 26.4'],
      testOn: ['iOS 26.4'],
    },
    ipad: {
      createdOn: ['iOS 26.4'],
      testOn: ['iOS 26.4'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers most of the manual scenario steps on iPhone, plus a subset on iPad. iPhone: covers the initial load, all five content variants, accessory persistence across tab switches, and the regular/inline layout transitions during tab bar minimize (ScrollDown and ScrollUp tabs). iPad: covers the full-size app case only (iPad only - full-size app step 1) - the initial load and all five content variants, asserting the accessory renders and stays anchored to the bottom of the screen. Not covered: text alignment verification in the bottom accessory, content verification for the last two variants, the variant selection visual check (the blue border), extending the tab bar using the collapsed tab bar state, and the iPad compact-width size class cases (all steps except iPad only - full-size app), because the inline effect and tab bar minimize require resizing the window to compact width, which Detox does not support.',
  smokeTest: false,
};
