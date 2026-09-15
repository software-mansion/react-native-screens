import { device, expect, element, by, waitFor } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import {
  expectFormSheetDetentIndex,
  getIOSFormSheetFrames,
} from '../../elements/form-sheet';
import {
  describeIfiPad,
  describeIfiPadOS26,
  expectDimmingIfiOS,
  expectNoDimmingIfiOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const DETENTS = [0.6, 1.0];

describe('Formsheet: base functionality', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('FormSheet', 'test-form-sheet-base');
  });

  it('should display main screen with button', async () => {
    await expect(element(by.id('formsheet-base-title'))).toHaveLabel(
      'FormSheet Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
  });

  it('should open FormSheet on lower detent when button is pressed', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await expect(element(by.id('formsheet-base-content'))).toHaveLabel(
      'FormSheet content',
    );
    await expect(element(by.id('dismiss-formsheet-button'))).toBeVisible();
    await expectDimmingIfiOS();
    await expectFormSheetDetentIndex(DETENTS, 0);
  });

  it('should expand to the largest detent when dragged up', async () => {
    await element(by.id('formsheet-base-content')).swipe('up', 'slow', 0.5);
    await expectFormSheetDetentIndex(DETENTS, 1);
    await expectDimmingIfiOS();
  });

  it('should settles at lower detent when swipe down', async () => {
    await element(by.id('formsheet-base-content')).swipe('down', 'slow', 0.5);
    await expectFormSheetDetentIndex(DETENTS, 0);
    await expectDimmingIfiOS();
  });

  it('should close FormSheet when dismiss button is pressed', async () => {
    await element(by.id('dismiss-formsheet-button')).tap();
    await expect(element(by.id('formsheet-base-title'))).toHaveLabel(
      'FormSheet Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
    await expect(element(by.id('formsheet-base-content'))).not.toExist();
    await expect(element(by.id('dismiss-formsheet-button'))).not.toExist();
    await expectNoDimmingIfiOS();
  });

  it('should dismiss natively when swiped down past the lower detent', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await waitFor(element(by.id('formsheet-base-content')))
      .toBeVisible()
      .withTimeout(3000);
    await expectFormSheetDetentIndex(DETENTS, 0);
    await expectDimmingIfiOS();

    await element(by.id('formsheet-base-content')).swipe('down', 'fast');
    await waitFor(element(by.id('formsheet-base-content')))
      .not.toExist()
      .withTimeout(3000);
    await expectNoDimmingIfiOS();
  });
});

// On iPad the sheet is a centered floating panel, so the bottom-anchored detent
// math used above does not apply. Detents are verified relatively instead: the
// panel grows when dragged up and returns to its opening height when dragged
// back down.
describeIfiPad('@ipad Formsheet: base functionality', () => {
  // Absorbs sub-point rounding in frames reported by UIKit.
  const FRAME_TOLERANCE_PT = 1;
  let openedHeight: number;

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('FormSheet', 'test-form-sheet-base');
  });

  it('should display main screen with button', async () => {
    await expect(element(by.id('formsheet-base-title'))).toHaveLabel(
      'FormSheet Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
  });

  it('should present FormSheet as a centered floating panel', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await expect(element(by.id('formsheet-base-content'))).toHaveLabel(
      'FormSheet content',
    );
    await expect(element(by.id('dismiss-formsheet-button'))).toBeVisible();
    await expectDimmingIfiOS();

    const { sheet, window } = await getIOSFormSheetFrames();
    jestExpect(sheet.width).toBeLessThan(window.width);
    jestExpect(
      Math.abs(sheet.x + sheet.width / 2 - (window.x + window.width / 2)),
    ).toBeLessThanOrEqual(FRAME_TOLERANCE_PT);
    openedHeight = sheet.height;
  });

  it('should grow when dragged up to the largest detent', async () => {
    await element(by.id('formsheet-base-content')).swipe('up', 'slow', 0.5);
    const { sheet } = await getIOSFormSheetFrames();
    jestExpect(sheet.height).toBeGreaterThan(openedHeight + FRAME_TOLERANCE_PT);
    await expectDimmingIfiOS();
  });

  it('should return to the opening height when dragged back down', async () => {
    await element(by.id('formsheet-base-content')).swipe('down', 'slow', 0.2);
    const { sheet } = await getIOSFormSheetFrames();
    jestExpect(Math.abs(sheet.height - openedHeight)).toBeLessThanOrEqual(
      FRAME_TOLERANCE_PT,
    );
    await expectDimmingIfiOS();
  });

  it('should close FormSheet when dismiss button is pressed', async () => {
    await element(by.id('dismiss-formsheet-button')).tap();
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
    await expect(element(by.id('formsheet-base-content'))).not.toExist();
    await expectNoDimmingIfiOS();
  });

  it('should dismiss natively when swiped down', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await waitFor(element(by.id('formsheet-base-content')))
      .toBeVisible()
      .withTimeout(3000);
    await expectDimmingIfiOS();

    await element(by.id('formsheet-base-content')).swipe('down', 'fast');
    await waitFor(element(by.id('formsheet-base-content')))
      .not.toExist()
      .withTimeout(3000);
    await expectNoDimmingIfiOS();
  });
});
