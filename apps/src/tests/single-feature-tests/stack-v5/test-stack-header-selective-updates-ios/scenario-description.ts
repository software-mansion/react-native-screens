import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Selective Updates (iOS)',
  key: 'test-stack-header-selective-updates-ios',
  details:
    'Changing, adding, removing, reordering or resizing one header item leaves the other items in place without a flash, and custom items keep reacting to touches where they are drawn.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'The Custom items after layout changes and Navigation sections are not automated. For manual testing perform Baseline, Update one item steps 1 and 6, and all steps of Add and remove an item, Custom items after layout changes and Navigation. Flashes, blurs and the color of a pressed custom item are not assertable with Detox.',
  smokeTest: false,
};
