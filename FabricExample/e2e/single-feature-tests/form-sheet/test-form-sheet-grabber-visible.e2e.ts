import { device, expect, element, by, waitFor } from 'detox';
import { expectFormSheetDetentIndex } from '@e2e/framework/form-sheet';
import { countMatches } from '@e2e/framework/matchers';
import { CLASS_NAME_ANDROID_BOTTOM_SHEET_DRAG_HANDLE_VIEW } from '@e2e/framework/native-classes-android';
import { CLASS_NAME_UI_GRABBER } from '@e2e/framework/native-classes-ios';
import { DEFAULT_TIMEOUT_MS, waitUntil } from '@e2e/framework/wait';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';

const OPEN_BUTTON = 'open-formsheet-button';
const SHEET_CONTENT = 'formsheet-grabber-content';
const HOST_SWITCH = 'host-grabber-switch';
const SHEET_SWITCH = 'sheet-grabber-switch';
const DISMISS_BUTTON = 'dismiss-formsheet-button';
const DETENTS = [0.6, 1.0];

/**
 * iOS creates `_UIGrabber` only once the grabber is first shown, and afterwards
 * hides it at alpha 0 while Detox still reports it visible. Presence is
 * therefore reliable only for a freshly presented sheet, and for "appears".
 */
async function expectGrabber(visible: boolean): Promise<void> {
  if (device.getPlatform() === 'android') {
    const handle = element(
      by.type(CLASS_NAME_ANDROID_BOTTOM_SHEET_DRAG_HANDLE_VIEW),
    );
    if (visible) {
      await waitFor(handle).toBeVisible().withTimeout(DEFAULT_TIMEOUT_MS);
    } else {
      await waitFor(handle).not.toBeVisible().withTimeout(DEFAULT_TIMEOUT_MS);
    }
    return;
  }
  await waitUntil(
    async () => {
      const count = await countMatches(by.type(CLASS_NAME_UI_GRABBER), {
        orEmpty: true,
      });
      return count > 0 === visible;
    },
    { message: `iOS grabber to be ${visible ? 'present' : 'absent'}` },
  );
}

async function openSheet(): Promise<void> {
  await element(by.id(OPEN_BUTTON)).tap();
  await waitFor(element(by.id(SHEET_CONTENT)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

async function dismissBySwipe(): Promise<void> {
  await element(by.id(SHEET_CONTENT)).swipe('down', 'fast');
  await waitFor(element(by.id(SHEET_CONTENT)))
    .not.toExist()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

describe('Formsheet: grabber visibility', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'FormSheet',
      'test-form-sheet-grabber-visible',
    );
  });

  it('should show host switch off and the open button', async () => {
    await expect(element(by.id(HOST_SWITCH))).toBeVisible();
    await expect(element(by.id(HOST_SWITCH))).toHaveToggleValue(false);
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
  });

  it('should present at the lower detent without a grabber by default', async () => {
    await openSheet();
    await expect(element(by.id(SHEET_SWITCH))).toHaveToggleValue(false);
    await expectFormSheetDetentIndex(DETENTS, 0);
    await expectGrabber(false);
  });

  it('should dismiss by swipe', async () => {
    await dismissBySwipe();
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
  });

  it('should present with a grabber when enabled from the host screen', async () => {
    await element(by.id(HOST_SWITCH)).tap();
    await openSheet();
    await expect(element(by.id(SHEET_SWITCH))).toHaveToggleValue(true);
    await expectFormSheetDetentIndex(DETENTS, 0);
    await expectGrabber(true);
  });

  it('should present without a grabber after disabling it on the host screen', async () => {
    await dismissBySwipe();
    await element(by.id(HOST_SWITCH)).tap();
    await openSheet();
    await expectGrabber(false);
  });

  it('should dismiss by swipe again', async () => {
    await dismissBySwipe();
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
  });

  it('should show the grabber when enabled inside the presented sheet', async () => {
    await openSheet();
    await expectGrabber(false);

    await element(by.id(SHEET_SWITCH)).tap();
    await expect(element(by.id(SHEET_CONTENT))).toBeVisible();
    await expectGrabber(true);
  });

  it('should hide the grabber when disabled inside the presented sheet', async () => {
    await element(by.id(SHEET_SWITCH)).tap();
    await expect(element(by.id(SHEET_CONTENT))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await expectGrabber(false);
    }
  });

  it('should reflect the last in-sheet value on the host switch after JS dismiss', async () => {
    await element(by.id(SHEET_SWITCH)).tap();
    await expect(element(by.id(SHEET_SWITCH))).toHaveToggleValue(true);
    await element(by.id(DISMISS_BUTTON)).tap();

    await waitFor(element(by.id(SHEET_CONTENT)))
      .not.toExist()
      .withTimeout(DEFAULT_TIMEOUT_MS);
    await expect(element(by.id(HOST_SWITCH))).toHaveToggleValue(true);
  });
});
