import { device, expect, element, by } from 'detox';
import { selectIssueTestScreen } from '../e2e-utils';

async function checkScreenVisibility(visible: boolean[]) {
  for (const [index, shouldBeVisible] of visible.entries()) {
    const assertionElement = expect(
      element(
        by.id('screen-text-added-routes-number').and(by.text(`${index}`)),
      ),
    );

    if (shouldBeVisible) {
      await assertionElement.toBeVisible();
    } else {
      await assertionElement.not.toBeVisible();
    }
  }
}

describe('Test658', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test658 should exist', async () => {
    await selectIssueTestScreen('Test658');
  });

  it('modals should hide content behind', async () => {
    await checkScreenVisibility([true]);

    await element(by.id('screen-0-button-open-modal')).tap();
    await checkScreenVisibility([false, true]);

    await element(by.id('screen-1-button-open-modal')).tap();
    await checkScreenVisibility([false, false, true]);

    await element(by.id('screen-2-button-open-modal')).tap();
    await checkScreenVisibility([false, false, false, true]);

    await element(by.id('screen-3-button-go-back')).tap();
    await checkScreenVisibility([false, false, true, false]);

    await element(by.id('screen-2-button-go-back')).tap();
    await checkScreenVisibility([false, true, false, false]);

    await element(by.id('screen-1-button-go-back')).tap();
    await checkScreenVisibility([true, false, false, false]);
  });

  it('transparent modals should not hide content behind', async () => {
    await checkScreenVisibility([true]);

    await element(by.id('screen-0-button-open-transparent-modal')).tap();
    await checkScreenVisibility([true, true]);

    await element(by.id('screen-1-button-open-transparent-modal')).tap();
    await checkScreenVisibility([true, true, true]);

    await element(by.id('screen-2-button-open-transparent-modal')).tap();
    await checkScreenVisibility([true, true, true, true]);

    await element(by.id('screen-3-button-go-back')).tap();
    await checkScreenVisibility([true, true, true, false]);

    await element(by.id('screen-2-button-go-back')).tap();
    await checkScreenVisibility([true, true, false, false]);

    await element(by.id('screen-1-button-go-back')).tap();
    await checkScreenVisibility([true, false, false, false]);
  });

  it('opening modals and transparent modals should show correct screens', async () => {
    await checkScreenVisibility([true]);

    await element(by.id('screen-0-button-open-transparent-modal')).tap();
    await checkScreenVisibility([true, true]);

    await element(by.id('screen-1-button-open-transparent-modal')).tap();
    await checkScreenVisibility([true, true, true]);

    await element(by.id('screen-2-button-open-modal')).tap();
    await checkScreenVisibility([false, false, false, true]);

    await element(by.id('screen-3-button-open-transparent-modal')).tap();
    await checkScreenVisibility([false, false, false, true, true]);

    await element(by.id('screen-4-button-open-transparent-modal')).tap();
    await checkScreenVisibility([false, false, false, true, true, true]);

    await element(by.id('screen-5-button-open-transparent-modal')).tap();
    await checkScreenVisibility([false, false, false, true, true, true, true]);

    await element(by.id('screen-6-button-open-modal')).tap();
    await checkScreenVisibility([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it('closing modals and transparent modals should show correct screens', async () => {
    await element(by.id('screen-7-button-go-back')).tap();
    await checkScreenVisibility([
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
    ]);

    await element(by.id('screen-6-button-go-back')).tap();
    await checkScreenVisibility([
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
    ]);

    await element(by.id('screen-5-button-go-back')).tap();
    await checkScreenVisibility([
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
    ]);

    await element(by.id('screen-4-button-go-back')).tap();
    await checkScreenVisibility([
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
    ]);

    await element(by.id('screen-3-button-go-back')).tap();
    await checkScreenVisibility([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);

    await element(by.id('screen-2-button-go-back')).tap();
    await checkScreenVisibility([
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);

    await element(by.id('screen-1-button-go-back')).tap();
    await checkScreenVisibility([
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });
});
