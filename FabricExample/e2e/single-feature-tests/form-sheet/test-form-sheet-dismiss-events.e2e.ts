import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../helpers/app/test-screen-navigation';
import {
  clearEventLog,
  expectEmptyEventLog,
  expectEventLog,
  expectFormSheetDismissed,
  openFormSheet,
} from '@e2e/app/form-sheet-event-log';
import { getFrame } from '@e2e/framework/matchers';
import { CLASS_NAME_ANDROID_COORDINATOR_LAYOUT } from '@e2e/framework/native-classes-android';

const itIfAndroid = device.getPlatform() === 'android' ? it : it.skip;

/**
 * Taps the dimmed area outside the sheet. Android reports frames in px but
 * takes tap points in dp, so it taps the sheet dialog's full-window layout at a
 * fixed dp offset well above the lower detent instead of converting units.
 */
async function tapFormSheetBackdrop() {
  if (device.getPlatform() === 'android') {
    await element(by.type(CLASS_NAME_ANDROID_COORDINATOR_LAYOUT)).tap({
      x: 24,
      y: 80,
    });
    return;
  }
  // The host title sits above the sheet (iPhone) or beside the floating panel
  // (iPad). Rounded: Detox iOS silently taps (100, 100) on fractional points.
  const { x, y, width, height } = await getFrame(
    by.id('formsheet-dismiss-events-title'),
  );
  await device.tap({
    x: Math.round(x + width / 2),
    y: Math.round(y + height / 2),
  });
}

describe('FormSheet: dismiss events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'FormSheet',
      'test-form-sheet-dismiss-events',
    );
  });

  it('should show the host screen with an empty event log', async () => {
    await expect(element(by.id('formsheet-dismiss-events-title'))).toHaveLabel(
      'FormSheet Dismiss Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
    await expect(element(by.id('clear-logs-button'))).toBeVisible();
    await expectEmptyEventLog();
  });

  it('should log only onNativeDismiss when swiped down past the lower detent', async () => {
    await openFormSheet();
    await element(by.id('formsheet-base-content')).swipe('down', 'fast');
    await expectFormSheetDismissed();
    await expectEventLog(['onNativeDismiss']);
  });

  it('should log only onNativeDismiss when the backdrop is tapped', async () => {
    await openFormSheet();
    await tapFormSheetBackdrop();
    await expectFormSheetDismissed();
    await expectEventLog(['onNativeDismiss', 'onNativeDismiss']);
  });

  it('should empty the event log when Clear Logs is pressed', async () => {
    await clearEventLog();
  });

  it('should log only onDismiss when dismissed from JS', async () => {
    await openFormSheet();
    await element(by.id('dismiss-formsheet-button')).tap();
    await expectFormSheetDismissed();
    await expectEventLog(['onDismiss']);
  });

  itIfAndroid(
    'should log only onNativeDismiss when dismissed with system back',
    async () => {
      await openFormSheet();
      await device.pressBack();
      await expectFormSheetDismissed();
      await expectEventLog(['onDismiss', 'onNativeDismiss']);
    },
  );
});
