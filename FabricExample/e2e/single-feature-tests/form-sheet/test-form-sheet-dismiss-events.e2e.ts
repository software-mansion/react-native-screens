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
 * Backdrop tap point on Android, in dp from the dialog window's top-left
 * (Detox takes tap points in dp, but reports frames in px).
 * - y: 80 clears the status bar (~24–50 dp) and stays far above the sheet at
 *   the 0.6 detent, whose top sits at 40% of the window (300+ dp on any phone).
 * - x: any value works; the backdrop spans the full width.
 */
const ANDROID_BACKDROP_TAP_DP = { x: 24, y: 80 };

/** Taps the dimmed area outside the sheet. */
async function tapFormSheetBackdrop() {
  if (device.getPlatform() === 'android') {
    await element(by.type(CLASS_NAME_ANDROID_COORDINATOR_LAYOUT)).tap(
      ANDROID_BACKDROP_TAP_DP,
    );
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
