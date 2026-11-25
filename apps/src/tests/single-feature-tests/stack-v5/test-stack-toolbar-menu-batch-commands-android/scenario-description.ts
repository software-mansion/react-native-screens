import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Batch Commands',
  key: 'test-stack-toolbar-menu-batch-commands-android',
  details:
    'Tests batched updates via the updateToolbarMenuElements view command.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers Baseline — initial render step 1 and all steps of every later subsection. Not automated: Baseline — initial render step 2 (downloading the photo from the web), since the e2e test keeps Bundled image on and runs the image cases offline on the bundled photo; the appearance of the photo icon itself, since Detox cannot read image bytes, so an icon is only asserted present or absent (verify visually); same-instant atomicity of an image-and-check batch, since only the final state is asserted (verify visually that the icon and the check appear together).',
  smokeTest: false,
};
