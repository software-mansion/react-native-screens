import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

// issue related to iOS modal behavior
describeIfiOS('Test691', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test691 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test691')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test691'))).toBeVisible();
    await element(by.id('root-screen-tests-Test691')).tap();
  });

  it('modal on tab1 should open', async () => {
    await expect(element(by.text('This is a first screen!'))).toBeVisible();

    await element(by.id('first-button-open-modal')).tap();

    await expect(element(by.text('This is a first screen!'))).not.toBeVisible();
    await expect(element(by.text('This is a modal screen!'))).toBeVisible();
  });

  it('switching tabs should not hide the modal', async () => {
    await element(by.id('modal-button-go-to-tab2')).tap();

    await expect(element(by.text('This is a modal screen!'))).toBeVisible();
    await expect(element(by.text('This is a first screen!'))).not.toBeVisible();
    await expect(
      element(by.text('This is a second screen!')),
    ).not.toBeVisible();
  });

  it('closing the modal should reveal changed tab', async () => {
    await element(by.text('Modal')).swipe('down', 'fast');

    await expect(element(by.text('This is a modal screen!'))).not.toBeVisible();
    await expect(element(by.text('This is a second screen!'))).toBeVisible();
  });
});
