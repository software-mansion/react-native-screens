import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

async function tapTab(label: string) {
  if (device.getPlatform() === 'android') {
    await element(by.text(`Tab ${label}`)).tap();
  } else {
    await element(by.id(`tab-${label.toLowerCase()}-item`)).tap();
  }
}

async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

describe('Tabs lifecycle events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-events');
  });

  it('should show Tab A content and fire onWillAppear + onDidAppear on launch', async () => {
    await expect(element(by.id('tabContent-TabA'))).toBeVisible();
    await dismissToast('2. TabA: onDidAppear');
    await dismissToast('1. TabA: onWillAppear');
  });

  it('should fire four lifecycle events in order when switching from Tab A to Tab B', async () => {
    await tapTab('B');

    await expect(element(by.id('tabContent-TabB'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('4. TabB: onDidAppear');
      await dismissToast('3. TabB: onWillAppear');
      await dismissToast('2. TabA: onDidDisappear');
      await dismissToast('1. TabA: onWillDisappear');
    } else {
      await dismissToast('4. TabA: onDidDisappear');
      await dismissToast('3. TabB: onDidAppear');
      await dismissToast('2. TabA: onWillDisappear');
      await dismissToast('1. TabB: onWillAppear');
    }
  });

  it('should fire four lifecycle events in order when switching from Tab B to Tab C', async () => {
    await tapTab('C');

    await expect(element(by.id('tabContent-TabC'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('4. TabC: onDidAppear');
      await dismissToast('3. TabC: onWillAppear');
      await dismissToast('2. TabB: onDidDisappear');
      await dismissToast('1. TabB: onWillDisappear');
    } else {
      await dismissToast('4. TabB: onDidDisappear');
      await dismissToast('3. TabC: onDidAppear');
      await dismissToast('2. TabB: onWillDisappear');
      await dismissToast('1. TabC: onWillAppear');
    }
  });

  it('should fire four lifecycle events in order when switching from Tab C to Tab A', async () => {
    await tapTab('A');

    await expect(element(by.id('tabContent-TabA'))).toBeVisible();
    if (device.getPlatform() === 'android') {
      await dismissToast('4. TabA: onDidAppear');
      await dismissToast('3. TabA: onWillAppear');
      await dismissToast('2. TabC: onDidDisappear');
      await dismissToast('1. TabC: onWillDisappear');
    } else {
      await dismissToast('4. TabC: onDidDisappear');
      await dismissToast('3. TabA: onDidAppear');
      await dismissToast('2. TabC: onWillDisappear');
      await dismissToast('1. TabA: onWillAppear');
    }
  });

  it('Android only: should not fire any lifecycle events when re-tapping the active tab', async () => {
    if (device.getPlatform() === 'ios') {
      return;
    }
    await tapTab('A');

    await expect(element(by.id('tabContent-TabA'))).toBeVisible();

    await expect(element(by.label('1. TabA: onWillAppear'))).not.toExist();
    await expect(element(by.label('1. TabA: onDidAppear'))).not.toExist();
    await expect(element(by.label('1. TabA: onWillDisappear'))).not.toExist();
    await expect(element(by.label('1. TabA: onDidDisappear'))).not.toExist();
  });
});
