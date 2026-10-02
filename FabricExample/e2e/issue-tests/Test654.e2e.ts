import { device, element, by } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { expectHeaderViewShown } from '@e2e/framework/header-items-ios';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '@e2e/framework/native-classes-ios';
import { describeIfIOS } from '@e2e/framework/platform';

// issue related to iOS native back button
describeIfIOS('Test654', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await element(by.id('root-screen-switch-rtl')).tap();
  });

  it('Test654 should exist', async () => {
    await selectIssueTestScreen('Test654');
  });

  it('back button should be visible on Second screen', async () => {
    await element(by.id('first-button-go-to-second')).tap();
    await expectHeaderViewShown(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON), 100);
    await expectHeaderViewShown(by.id('chevron.backward'), 100);
  });
});
