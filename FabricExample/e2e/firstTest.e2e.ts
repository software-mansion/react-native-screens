import { device, expect, element, by } from 'detox';

const SCREENS: Record<
  string,
  {
    title: string;
    type: 'example' | 'playground';
  }
> = {
  SimpleNativeStack: {
    title: 'Simple Native Stack',
    type: 'example',
  },
  StackPresentation: {
    title: 'Stack Presentation',
    type: 'example',
  },
  BottomTabsAndStack: {
    title: 'Bottom tabs and native stack',
    type: 'example',
  },
  Modals: {
    title: 'Modals',
    type: 'example',
  },
  HeaderOptions: {
    title: 'Header Options',
    type: 'playground',
  },
  StatusBar: {
    title: 'Status bar',
    type: 'playground',
  },
  Animations: {
    title: 'Animations',
    type: 'playground',
  },
  Orientation: {
    title: 'Orientation',
    type: 'playground',
  },
  SearchBar: {
    title: 'Search bar',
    type: 'playground',
  },
};

describe('Example', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should have root screen', async () => {
    await expect(element(by.id('root-screen-examples-header'))).toExist();
  });

  it('should have all example and playground buttons rendered', async () => {
    const allNames = Object.keys(SCREENS);
    for (const name of allNames) {
      await expect(
        element(by.id(`root-screen-example-${name}`)),
      ).toExist();
    }
  });
});
