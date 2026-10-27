import { device, expect, element, by } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { describeIfIOSAtLeast } from '@e2e/framework/platform';

// Header contents render blank in Detox's visibility snapshot here, so the
// screens report the navigation bar's state (`hidden` or its alpha) instead.
async function expectNavigationBarShown(probeId: string) {
  await expect(element(by.id(probeId))).toHaveValue('1.00');
}

// A short, slow drag springs the zoomed screen back (cancelled dismissal),
// a long, fast one dismisses it.
async function cancelZoomDismissal(screenTextId: string) {
  await element(by.id(screenTextId)).swipe('down', 'slow', 0.15);
}

async function completeZoomDismissal(screenTextId: string) {
  await element(by.id(screenTextId)).swipe('down', 'fast', 0.75);
}

// zoom transition is iOS 18+
describeIfIOSAtLeast('18.0')('Test5054', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test5054 should exist', async () => {
    await selectIssueTestScreen('Test5054');
  });

  it('header stays shown after a cancelled zoom dismissal to a headerless screen', async () => {
    await element(by.id('home-button-push-zoomed')).tap();
    await expectNavigationBarShown('zoomed-bar-probe');

    await cancelZoomDismissal('zoomed-text');

    await expect(element(by.id('zoomed-text'))).toBeVisible();
    await expectNavigationBarShown('zoomed-bar-probe');
  });

  it('header of the next pushed screen is shown after a completed zoom dismissal', async () => {
    await completeZoomDismissal('zoomed-text');
    await expect(element(by.id('home-button-push-regular'))).toBeVisible();

    await element(by.id('home-button-push-regular')).tap();

    await expect(element(by.id('regular-text'))).toBeVisible();
    await expectNavigationBarShown('regular-bar-probe');
  });

  it('header is shown after going back from a headerless screen whose zoom dismissal was cancelled', async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test5054');
    await element(by.id('home-button-push-zoomed')).tap();
    await element(by.id('zoomed-button-push-headerless')).tap();

    await cancelZoomDismissal('headerless-text');
    await expect(element(by.id('headerless-text'))).toBeVisible();

    await element(by.id('headerless-button-go-back')).tap();
    await expect(element(by.id('zoomed-text'))).toBeVisible();
    await expectNavigationBarShown('zoomed-bar-probe');
  });
});
