import { device, expect, element, by } from 'detox';
import { expectFormSheetDetentIndex } from '../../elements/form-sheet';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
const DETENTS = [0.6, 1.0];

describeIfiOS('Formsheet: base functionality', () => {
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
    await expect(
      element(
        by.type('UIDimmingView').withAncestor(by.type('UIDropShadowView')),
      ),
    ).toExist();
    await expectFormSheetDetentIndex(DETENTS, 0);
  });

  it('should expand to the largest detent when dragged up', async () => {
    await element(by.id('formsheet-base-content')).swipe('up', 'slow', 0.5);
    await expectFormSheetDetentIndex(DETENTS, 1);
  });

  it('should settles at lower detent when swipe down', async () => {
    await element(by.id('formsheet-base-content')).swipe('down', 'slow', 0.5);
    await expectFormSheetDetentIndex(DETENTS, 0);
  });

  it('should close FormSheet when dismissbutton is pressed', async () => {
    await element(by.id('dismiss-formsheet-button')).tap();
    await expect(element(by.id('formsheet-base-title'))).toHaveLabel(
      'FormSheet Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
    await expect(element(by.id('formsheet-base-content'))).not.toExist();
    await expect(element(by.id('dismiss-formsheet-button'))).not.toExist();
  });

  it('should dismiss natively when swiped down past the lower detent and reopen at the lower detent', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await waitFor(element(by.id('formsheet-base-content')))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id('formsheet-base-content')).swipe('down', 'fast');
    await waitFor(element(by.id('formsheet-base-content')))
      .not.toExist()
      .withTimeout(3000);
  });

  // it('should stay on First tab when re-tapping the active First tab bar item', async () => {
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  //   device.getPlatform() === 'ios'
  //     ? await forceTapByLabeliOS('FirstTab')
  //     : await element(by.id('tab-bar-item-first')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });

  // it('should stay on First tab when calling selectTab on the already-active tab programmatically', async () => {
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  //   await element(by.id('select-first-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });
});
