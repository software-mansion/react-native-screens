import { device, expect, element, by } from 'detox';
import { expectFormSheetDetentIndex } from '../../elements/form-sheet';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
const DETENTS = [0.6, 1.0];

describeIfiOS('Formsheet: base functionality', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('FormSheet', 'test-form-sheet-base');
  });

  it('should display main screen with open button', async () => {
    await expect(element(by.id('formsheet-base-title'))).toHaveLabel(
      'FormSheet Test',
    );
    await expect(element(by.id('open-formsheet-button'))).toBeVisible();
  });

  it('should open FormSheet on lower detentwhen button is pressed', async () => {
    await element(by.id('open-formsheet-button')).tap();
    await expect(element(by.id('formsheet-base-content'))).toHaveLabel(
      'FormSheet content',
    );
    await expect(
      element(
        by.type('UIDimmingView').withAncestor(by.type('UIDropShadowView')),
      ),
    ).toExist();
    await expectFormSheetDetentIndex(DETENTS, 0);
  });

  it('should navigate to Third tab via tab bar', async () => {
    await element(by.type('RNSFormSheetContentView')).longPressAndDrag(
      2000,
      0.9,
      NaN,
      element(by.id('cellId_6')),
      0.9,
      NaN,
      'slow',
      0,
    );
    await expectFormSheetDetentIndex(DETENTS, 1);
  });

  // it('should navigate back to First tab via tab bar', async () => {
  //   await element(by.id('tab-bar-item-first')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });

  // it('should navigate to Second tab programmatically via Select Second button', async () => {
  //   await element(by.id('select-second-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('Second');
  // });

  // it('should navigate to Third tab programmatically via Select Third button', async () => {
  //   await element(by.id('select-third-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  // });

  // it('should navigate to First tab programmatically via Select First button', async () => {
  //   await element(by.id('select-first-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });

  // it('should skip Second tab when navigating directly from First to Third programmatically', async () => {
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  //   await element(by.id('select-third-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  // });

  // it('should skip Second tab when navigating directly from Third to First via tab bar', async () => {
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  //   await element(by.id('tab-bar-item-first')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });

  // it('should navigate correctly after mixing tab-bar and programmatic navigation', async () => {
  //   await element(by.id('tab-bar-item-second')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('Second');
  //   await element(by.id('select-first-button')).tap();
  //   await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  // });

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
