import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { describeIfIOS } from '@e2e/framework/platform';

type InputPlacement = 'title' | 'left' | 'right';

async function expectInputFocused(focused: boolean, blurCount: number) {
  await expect(element(by.id('input-focused'))).toHaveText(
    `Input focused: ${focused}`,
  );
  await expect(element(by.id('input-blur-count'))).toHaveText(
    `Blur count: ${blurCount}`,
  );
}

async function tapButton(testID: string) {
  await element(by.id(testID)).tap();
}

// Every update below re-applies the native header config (a prop change or a
// header subview mounted / unmounted), which used to remove the header
// subviews from the window and add them back, dismissing the keyboard.
describe('Stack v4 header subviews keep focus', () => {
  // Each placement blurs the input once, at the end of its suite.
  let blurCount = 0;

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv4',
      'stack-v4-header-subviews-keep-focus',
    );
  });

  describe.each<InputPlacement>(['title', 'left', 'right'])(
    'with the input in the header %s',
    placement => {
      beforeAll(async () => {
        await tapButton(`placement-${placement}`);
        await expect(element(by.id('input-placement'))).toHaveText(
          `Input in: ${placement}`,
        );
      });

      it('should focus the header input', async () => {
        await element(by.id('header-input')).tap();
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when the header title changes', async () => {
        await tapButton('change-title');
        await expect(element(by.id('header-title-text'))).toHaveText(
          'Title: Focus updated',
        );
        await expectInputFocused(true, blurCount);

        await tapButton('change-title');
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when the header tint color changes', async () => {
        await tapButton('change-tint');
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when a native bar button item changes', async () => {
        await tapButton('change-bar-button-item');
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when a header subview is mounted', async () => {
        await tapButton('toggle-extra-view');
        await expect(element(by.id('header-extra-view'))).toBeVisible();
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when the content of another header subview changes', async () => {
        await tapButton('change-extra-view');
        await expectInputFocused(true, blurCount);
      });

      // On iOS 27 this re-assigns the bar button items on the extra view's side,
      // which must leave the input's side alone.
      it('should keep focus when the visibility priority of another header subview changes', async () => {
        await tapButton('change-extra-view-priority');
        await expectInputFocused(true, blurCount);

        await tapButton('change-extra-view-priority');
        await expectInputFocused(true, blurCount);
      });

      it('should keep focus when a header subview is unmounted', async () => {
        await tapButton('toggle-extra-view');
        await expect(element(by.id('header-extra-view'))).not.toExist();
        await expectInputFocused(true, blurCount);
      });

      // A second cycle checks that the subviews are still in the right place
      // after the first one, so the next update doesn't move the focused one.
      it('should keep focus when a header subview is mounted and unmounted again', async () => {
        await tapButton('toggle-extra-view');
        await expect(element(by.id('header-extra-view'))).toBeVisible();
        await expectInputFocused(true, blurCount);

        await tapButton('toggle-extra-view');
        await expect(element(by.id('header-extra-view'))).not.toExist();
        await expectInputFocused(true, blurCount);
      });

      it('should still let the input be blurred', async () => {
        await tapButton('blur-input');
        blurCount += 1;
        await expectInputFocused(false, blurCount);
      });
    },
  );

  // On the input's side, a bar button item change hands UIKit a new array of
  // items that still holds the input's bar button item.
  describeIfIOS('with native bar button items on the input side', () => {
    beforeAll(async () => {
      await tapButton('toggle-bar-button-items-side');
    });

    describe.each<'left' | 'right'>(['left', 'right'])(
      'with the input in the header %s',
      placement => {
        beforeAll(async () => {
          await tapButton(`placement-${placement}`);
          await expect(element(by.id('bar-button-items-side'))).toHaveText(
            `Bar button items on: ${placement}`,
          );
        });

        it('should focus the header input', async () => {
          await element(by.id('header-input')).tap();
          await expectInputFocused(true, blurCount);
        });

        it('should keep focus when a native bar button item changes', async () => {
          await tapButton('change-bar-button-item');
          await expectInputFocused(true, blurCount);

          await tapButton('change-bar-button-item');
          await expectInputFocused(true, blurCount);
        });

        it('should keep focus when a header subview is mounted and unmounted', async () => {
          await tapButton('toggle-extra-view');
          await expectInputFocused(true, blurCount);

          await tapButton('toggle-extra-view');
          await expectInputFocused(true, blurCount);
        });

        it('should still let the input be blurred', async () => {
          await tapButton('blur-input');
          blurCount += 1;
          await expectInputFocused(false, blurCount);
        });
      },
    );
  });
});
