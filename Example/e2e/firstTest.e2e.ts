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
  StackReactNavigation4: {
    title: 'Stack react-navigation v4',
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
