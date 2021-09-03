import { device, expect, element, by } from 'detox';
import { SCREENS } from '../App';

describe('Example', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should have root screen', async () => {
    await expect(element(by.id('root-screen-examples-header'))).toBeVisible();
  });

  it('should have examples buttons', async () => {
    const exampleNames = Object.keys(SCREENS).filter(
      (name) => SCREENS[name].type === 'example'
    );
    for (const name of exampleNames) {
      await expect(element(by.id(`root-screen-example-${name}`))).toBeVisible();
    }
  });
});
