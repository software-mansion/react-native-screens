import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

describeIfiOS('Test2842 - pressables in modal', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2842 should exist', async () => {
    await selectIssueTestScreen('Test2842');
  });

  it('Modal should open', async () => {
    const openModalButtonElement = element(by.id('home-button-open-modal'));
    await expect(openModalButtonElement).toExist();
    await openModalButtonElement.tap();

    // Verify that the modal has opened by checking that the "close" button is visible
    const closeModalButtonElement = element(by.id('modal-button-close'));
    await expect(closeModalButtonElement).toBeVisible();
  });

  it('HeaderRight subview should be visible', async () => {
    const headerRightElement = element(by.id('subview-headerright'));
    await expect(headerRightElement).toBeVisible(100);
  });

  it('HeaderRight should be pressable', async () => {
    const headerRightElement = element(by.id('subview-headerright'));
    await headerRightElement.tap();

    // These are rendered under the modal, therefore they are not visible at the first glance.
    await expect(element(by.text('1. onPressIn'))).toExist();
    await expect(element(by.text('2. onPress'))).toExist();
    await expect(element(by.text('3. onPressOut'))).toExist();
  });

  it('HeaderRight should not lose focus on swipe', async () => {
    const headerRightElement = element(by.id('subview-headerright'));

    await headerRightElement.swipe('right', 'slow', 0.15, 0.1, 0.5);

    // If the element has lost focus, it wouldn't fire onPress.
    // Note that when swiping the event order is different - but this is RN behaviour.
    await expect(element(by.text('4. onPressIn'))).toExist();
    await expect(element(by.text('5. onPressOut'))).toExist();
    await expect(element(by.text('6. onPress'))).toExist();
  });
});
