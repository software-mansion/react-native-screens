import { device, expect, element, by } from 'detox';
import { selectTestScreen } from '../e2e-utils';

describe('Native BottomTabs', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should select TestBottomTabs', async () => {
    await selectTestScreen('TestBottomTabs');
  });

  it('should initially display first tab', async () => {
    await expect(
      element(by.id('tab-screen-1-id')),
    ).toBeVisible();
  });

  it('should use tab id to navigate to third tab screen', async () => {
    const tabElement = element(by.id('tab-item-3-id'));
    await expect(tabElement).toBeVisible();
    await tabElement.tap();

    await expect(
      element(by.id('tab-screen-3-id')),
    ).toBeVisible();
  });

  it('should use tab label to navigate to second tab screen', async () => {
    const tabElement = element(by.label('Second Tab Item'));
    await expect(tabElement).toBeVisible();
    await tabElement.tap();

    await expect(
      element(by.label('Second Tab Screen')),
    ).toBeVisible();
  });
});
