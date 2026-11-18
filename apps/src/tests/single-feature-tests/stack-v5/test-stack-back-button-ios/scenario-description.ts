import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Button (iOS)',
  key: 'test-stack-back-button-ios',
  details:
    'Tests back button configuration, layout with respect to changing widths of elements in header, ' +
    'and toggling the long press navigation history menu. Back button props are configured on the screen ' +
    'that renders the back button, but the native configuration is performed on the screen below. ' +
    'The back button and the back menu follow the stack order after a replace and a push of several screens.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 18.6', 'iOS 26.4'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
