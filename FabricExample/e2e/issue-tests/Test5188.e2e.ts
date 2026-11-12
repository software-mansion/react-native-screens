import { by, device, element, expect } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { describeIfIOS } from '@e2e/framework/platform';

const LEFT_LABEL = 'Open settings';
const RIGHT_LABEL = 'Open help options';

describeIfIOS('Test5188', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test5188');
  });

  it('exposes separate test IDs and accessibility labels for a button and menu', async () => {
    await expect(
      element(by.id('header-left-button').and(by.label(LEFT_LABEL))),
    ).toExist();
    await expect(
      element(by.id('header-right-menu').and(by.label(RIGHT_LABEL))),
    ).toExist();
  });
});
