import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { dismissToast, expectNoToast } from '@e2e/app/toast';

describe('Tabs lifecycle events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-lifecycle-events');
  });

  it('should show Tab A content and fire onWillAppear + onDidAppear on launch', async () => {
    await expect(element(by.id('tabContent-TabA'))).toBeVisible();
    await dismissToast('TabA: onDidAppear');
    await dismissToast('TabA: onWillAppear');
    await expectNoToast();
  });

  it('should fire four lifecycle events in order when switching from Tab A to Tab B', async () => {
    await element(by.id(`tab-b-item`)).tap();

    await expect(element(by.id('tabContent-TabB'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('TabB: onDidAppear');
      await dismissToast('TabB: onWillAppear');
      await dismissToast('TabA: onDidDisappear');
      await dismissToast('TabA: onWillDisappear');
    } else {
      await dismissToast('TabA: onDidDisappear');
      await dismissToast('TabB: onDidAppear');
      await dismissToast('TabA: onWillDisappear');
      await dismissToast('TabB: onWillAppear');
    }

    await expectNoToast();
  });

  it('should fire four lifecycle events in order when switching from Tab B to Tab C', async () => {
    await element(by.id(`tab-c-item`)).tap();

    await expect(element(by.id('tabContent-TabC'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('TabC: onDidAppear');
      await dismissToast('TabC: onWillAppear');
      await dismissToast('TabB: onDidDisappear');
      await dismissToast('TabB: onWillDisappear');
    } else {
      await dismissToast('TabB: onDidDisappear');
      await dismissToast('TabC: onDidAppear');
      await dismissToast('TabB: onWillDisappear');
      await dismissToast('TabC: onWillAppear');
    }

    await expectNoToast();
  });

  it('should fire four lifecycle events in order when switching from Tab C to Tab A', async () => {
    await element(by.id(`tab-a-item`)).tap();

    await expect(element(by.id('tabContent-TabA'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('TabA: onDidAppear');
      await dismissToast('TabA: onWillAppear');
      await dismissToast('TabC: onDidDisappear');
      await dismissToast('TabC: onWillDisappear');
    } else {
      await dismissToast('TabC: onDidDisappear');
      await dismissToast('TabA: onDidAppear');
      await dismissToast('TabC: onWillDisappear');
      await dismissToast('TabA: onWillAppear');
    }

    await expectNoToast();
  });

  it('Android only: should not fire any lifecycle events when re-tapping the active tab', async () => {
    if (device.getPlatform() === 'ios') {
      return;
    }
    await element(by.id(`tab-a-item`)).tap();

    await expect(element(by.id('tabContent-TabA'))).toBeVisible();

    await expectNoToast();
  });
});
