import { device, element, by, expect } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { tapTopmost } from '@e2e/framework/gestures';
import { describeIfAndroid } from '@e2e/framework/platform';
import { stackV5BackButton } from '@e2e/framework/stack-header-android';

// Run native/predictive Back separately with the direct-launch scenario; the
// example menu nests this host in another navigator (see scenario.md).
describeIfAndroid('Stack v5: root replacement', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-root-replacement-android',
    );
  });

  it('replaces the sole root repeatedly and preserves push/pop history', async () => {
    await tapTopmost(by.id('replace-top'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-1');
    await expect(element(stackV5BackButton())).not.toExist();
    await tapTopmost(by.id('replace-top'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-2');
    await tapTopmost(by.id('push-detail'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-3');
    await tapTopmost(by.id('pop-detail'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-2');
    await expect(element(stackV5BackButton())).not.toExist();
    await expect(element(by.text('root-0'))).not.toExist();
    await expect(element(by.text('screen-1'))).not.toExist();
  });

  it('replaces a non-root screen and then resets an entire history', async () => {
    await tapTopmost(by.id('push-detail'));
    await tapTopmost(by.id('replace-top'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-2');
    await tapTopmost(by.id('pop-detail'));
    await expect(element(by.id('replacement-current'))).toHaveText('root-0');
    await tapTopmost(by.id('push-detail'));
    await tapTopmost(by.id('push-detail'));
    await tapTopmost(by.id('reset-root'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-5');
    await expect(element(stackV5BackButton())).not.toExist();
    await tapTopmost(by.id('push-detail'));
    await tapTopmost(by.id('pop-detail'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-5');
    await expect(element(by.text('root-0'))).not.toExist();
  });

  it('installs one new root and one back-stack entry for multiple pending pushes', async () => {
    await tapTopmost(by.id('replace-with-pair'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-2');
    await tapTopmost(by.id('pop-detail'));
    await expect(element(by.id('replacement-current'))).toHaveText('screen-1');
    await expect(element(stackV5BackButton())).not.toExist();
    await expect(element(by.text('root-0'))).not.toExist();
  });
});
