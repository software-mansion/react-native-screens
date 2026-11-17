import { device, element, by } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { tapBarBackButton } from '@e2e/framework/back-button';
import { expectHeaderViewShown } from '@e2e/framework/header-items-ios';
import { describeIfIOS } from '@e2e/framework/platform';

// Detox currently supports orientation only on iOS
describeIfIOS('Test528', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test528 should exist', async () => {
    await selectIssueTestScreen('Test528');
  });

  it('headerRight button should be visible after orientation change', async () => {
    await expectHeaderViewShown(by.text('Custom Button'), 100);
    await device.setOrientation('landscape');
    await expectHeaderViewShown(by.text('Custom Button'), 100);
    await device.setOrientation('portrait');
    await expectHeaderViewShown(by.text('Custom Button'), 100);
  });

  it('headerRight button should be visible after coming back from horizontal screen', async () => {
    await element(by.text('Go to Screen 2')).tap();
    await device.setOrientation('landscape');

    await tapBarBackButton();
    await expectHeaderViewShown(by.text('Custom Button'), 100);
    await device.setOrientation('portrait');
    await expectHeaderViewShown(by.text('Custom Button'), 100);
  });
});
