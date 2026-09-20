import { by, device, element, expect, waitFor } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

describeIfiOS('Split: empty stack columns', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Split',
      'test-split-empty-stack-columns-ios',
    );
  });

  it('keeps the list visible before the detail has a first screen', async () => {
    await expect(element(by.id('empty-column-list'))).toBeVisible();
    await expect(element(by.id('empty-column-state'))).toHaveText(
      'Details: 0; dismissals: 0',
    );
  });

  it('populates an initially empty detail and clears its final screen through activityMode', async () => {
    await element(by.text('Select detail')).tap();
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-1'))).toBeVisible();
    await element(by.text('Clear details')).tap();
    await waitFor(element(by.id('empty-column-state')))
      .toHaveText('Details: 0; dismissals: 1')
      .withTimeout(5000);
    await expect(element(by.id('empty-column-detail-1'))).not.toExist();
    await expect(element(by.id('empty-column-list'))).toBeVisible();
  });

  it('clears several attached screens together in top-to-bottom order', async () => {
    for (let index = 0; index < 3; index++) {
      await element(by.text('Select detail')).tap();
    }
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-4'))).toBeVisible();
    await element(by.text('Clear details')).tap();
    await waitFor(element(by.id('empty-column-state')))
      .toHaveText('Details: 0; dismissals: 4')
      .withTimeout(5000);
    await expect(element(by.id('empty-column-detail-4'))).not.toExist();
  });

  it('removes the entire detail stack in one mounting transaction and can populate it again', async () => {
    for (let index = 0; index < 3; index++) {
      await element(by.text('Select detail')).tap();
    }
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-7'))).toBeVisible();
    await element(by.text('Unmount details')).tap();
    await expect(element(by.id('empty-column-detail-7'))).not.toExist();
    await element(by.text('Show list')).tap();
    await expect(element(by.id('empty-column-list'))).toBeVisible();
    await element(by.text('Select detail')).tap();
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-8'))).toBeVisible();
  });

  it('can show an empty detail, return to the list, and select a detail again', async () => {
    await element(by.text('Clear details')).tap();
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-8'))).not.toExist();
    await expect(element(by.text('Select detail'))).toBeVisible();
    await element(by.text('Show list')).tap();
    await expect(element(by.id('empty-column-list'))).toBeVisible();
    await element(by.text('Select detail')).tap();
    await element(by.text('Show detail')).tap();
    await expect(element(by.id('empty-column-detail-9'))).toBeVisible();
  });
});
