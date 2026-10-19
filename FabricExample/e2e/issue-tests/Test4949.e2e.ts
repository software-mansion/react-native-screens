import { by, device, element, expect, waitFor } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { describeIfIOS } from '@e2e/framework/platform';

const innerSheet = () => element(by.id('test4949-inner-sheet'));
const outerSheet = () => element(by.id('test4949-outer-sheet'));

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function openOuterSheet(id = 'test4949-open-outer-sheet') {
  await element(by.id(id)).tap();
  await waitFor(outerSheet()).toBeVisible().withTimeout(5000);
}

// The inner sheet is presented, the outer one is gone, and the inner one is not torn down afterwards.
async function expectInnerSheetStays() {
  await waitFor(innerSheet()).toBeVisible().withTimeout(5000);
  await waitFor(outerSheet()).not.toExist().withTimeout(5000);
  await sleep(2000);
  await expect(innerSheet()).toBeVisible();
}

// The nested stack isn't left locked: closing and opening its sheet again still works.
async function expectNestedStackResponsive() {
  await element(by.id('test4949-close-inner-sheet')).tap();
  await waitFor(innerSheet()).not.toExist().withTimeout(5000);
  await element(by.id('test4949-open-inner-sheet')).tap();
  await waitFor(innerSheet()).toBeVisible().withTimeout(5000);
}

describeIfIOS('Test4949', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test4949');
  });

  it('presents the inner sheet when the outer one is closed just before', async () => {
    await openOuterSheet();
    await element(by.id('test4949-close-open-inner-sheet')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });

  // The stacks update in no fixed order, so repeat to exercise both.
  for (let run = 1; run <= 5; run++) {
    it(`presents the inner sheet when both change in one update (run ${run})`, async () => {
      await openOuterSheet();
      await element(by.id('test4949-close-open-inner-sheet-same-update')).tap();
      await expectInnerSheetStays();
      await expectNestedStackResponsive();
    });
  }

  it('presents a preloaded inner sheet activated in the same update (nested stack first)', async () => {
    await openOuterSheet();
    await element(by.id('test4949-close-open-preloaded-inner-sheet')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });

  it('presents the inner sheet when the outer one is closed while still opening', async () => {
    await element(by.id('test4949-outer-sheet-still-opening')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });

  it('presents the inner sheet when a React Native modal closes in the same update', async () => {
    await element(by.id('test4949-show-rn-modal')).tap();
    await waitFor(element(by.id('test4949-rn-modal')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('test4949-close-rn-modal-open-inner-sheet')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });

  it('presents the inner sheet when a non-animated outer sheet closes', async () => {
    await openOuterSheet('test4949-open-outer-sheet-no-animation');
    await element(by.id('test4949-close-open-inner-sheet-same-update')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });

  it('keeps a remounted nested stack responsive', async () => {
    await openOuterSheet();
    await element(by.id('test4949-close-open-inner-sheet-remount')).tap();
    await waitFor(element(by.id('test4949-list')))
      .toBeVisible()
      .withTimeout(5000);
    // The remounted stack starts without the sheet, and nothing the old stack presented is left behind.
    await expect(innerSheet()).not.toExist();
    await element(by.id('test4949-open-inner-sheet')).tap();
    await waitFor(innerSheet()).toBeVisible().withTimeout(5000);
  });

  it('presents the inner sheet when opened after the outer one has closed', async () => {
    await openOuterSheet();
    await element(by.id('test4949-close-open-inner-sheet-delayed')).tap();
    await expectInnerSheetStays();
    await expectNestedStackResponsive();
  });
});
