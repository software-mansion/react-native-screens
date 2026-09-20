import { expect as jestExpect } from '@jest/globals';
import { readFileSync } from 'fs';
import { PNG } from 'pngjs';
import type { IosElementAttributes } from 'detox/detox';
import { by, device, element, expect, waitFor } from 'detox';
import {
  describeIfiOS,
  contextMenu,
  dismissContextMenu,
  headerItem,
  isIOSVersionAtLeast,
  menuRow,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const toolbarItem = (title: string) => headerItem(title);
const button = (title: string) => element(by.text(title));
// The same completed swipe fails on unchanged main on iOS 18.
const itIfiOS26 = isIOSVersionAtLeast('26.0') ? it : it.skip;

// EarlGrey treats the SwiftUI floating-bar hosts as occluding their controls.
// On iOS 26, verify native item geometry and tap through the containing Fabric view.
async function expectToolbarItem(title: string) {
  const item = toolbarItem(title);
  if (!isIOSVersionAtLeast('26.0')) {
    await expect(item).toBeVisible();
    return;
  }
  await expect(item).toExist();
  const { frame } = (await item.getAttributes()) as IosElementAttributes;
  const screen = (await element(
    by.id('toolbar-screen-root'),
  ).getAttributes()) as IosElementAttributes;
  jestExpect(frame.width).toBeGreaterThan(0);
  jestExpect(frame.height).toBeGreaterThan(0);
  jestExpect(frame.y).toBeGreaterThan(screen.frame.y + screen.frame.height / 2);
  jestExpect(frame.y + frame.height).toBeLessThanOrEqual(
    screen.frame.y + screen.frame.height,
  );
}

async function tapToolbarControl(item: ReturnType<typeof element>) {
  if (!isIOSVersionAtLeast('26.0')) {
    await item.tap();
    return;
  }
  const { frame } = (await item.getAttributes()) as IosElementAttributes;
  const surface = element(
    by.type('RCTSurfaceView').withDescendant(by.id('toolbar-screen-root')),
  );
  const surfaceFrame = ((await surface.getAttributes()) as IosElementAttributes)
    .frame;
  await surface.tap({
    x: frame.x - surfaceFrame.x + frame.width / 2,
    y: frame.y - surfaceFrame.y + frame.height / 2,
  });
}

async function tapToolbarItem(title: string) {
  await tapToolbarControl(toolbarItem(title));
}

// SwiftUI can retain hidden toolbar controls with unchanged UIView visibility.
// Inspect the rendered action label against this scenario's uniform light background.
async function renderedActionPixels(
  name: string,
  frame: IosElementAttributes['frame'],
) {
  const surfaceFrame = (
    (await element(
      by.type('RCTSurfaceView').withDescendant(by.id('toolbar-screen-name')),
    ).getAttributes()) as IosElementAttributes
  ).frame;
  const png = PNG.sync.read(readFileSync(await device.takeScreenshot(name)));
  const scale = png.width / surfaceFrame.width;
  let pixels = 0;
  for (
    let y = Math.ceil(frame.y * scale);
    y < Math.floor((frame.y + frame.height) * scale);
    y++
  ) {
    for (
      let x = Math.ceil(frame.x * scale);
      x < Math.floor((frame.x + frame.width) * scale);
      x++
    ) {
      const offset = (y * png.width + x) * 4;
      if (
        Math.min(png.data[offset], png.data[offset + 1], png.data[offset + 2]) <
        200
      ) {
        pixels++;
      }
    }
  }
  return pixels;
}

async function expectScreen(name: string) {
  await waitFor(element(by.id('toolbar-screen-name')))
    .toHaveText(name)
    .withTimeout(3000);
}

describeIfiOS('Stack Toolbar Items (iOS)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-items-ios',
    );
    await expectScreen('First');
  });

  beforeEach(async () => {
    const menuOpen = await contextMenu()
      .getAttributes()
      .then(
        () => true,
        () => false,
      );
    if (menuOpen) {
      await dismissContextMenu();
    }
    const screen = (await element(
      by.id('toolbar-screen-name'),
    ).getAttributes()) as IosElementAttributes;
    if (screen.text !== 'First') {
      await button('Go back').tap();
      await expectScreen('First');
    }
    await button('Reset controls').tap();
  });

  it('updates a native item and dispatches toolbar menu callbacks', async () => {
    await expectToolbarItem('Unread');
    await tapToolbarItem('Unread');
    await expectToolbarItem('All');
    await expect(element(by.id('toolbar-filter'))).toHaveText('Filter: All');
    await expect(element(by.type('UIKeyboardLayoutStar'))).not.toExist();
    await tapToolbarItem('Actions');
    await waitFor(menuRow('Archive')).toBeVisible().withTimeout(3000);
    await menuRow('Archive').tap();
    await expect(element(by.id('toolbar-last-action'))).toHaveText(
      'Action: Archive',
    );
  });

  it('updates a fixed spacer without reversing item order', async () => {
    await tapToolbarItem('Unread');
    const before = (await toolbarItem(
      'First toolbar',
    ).getAttributes()) as IosElementAttributes;
    const filter = (await toolbarItem(
      'All',
    ).getAttributes()) as IosElementAttributes;
    const actions = (await toolbarItem(
      'Actions',
    ).getAttributes()) as IosElementAttributes;
    jestExpect(before.frame.x).toBeGreaterThan(filter.frame.x);
    jestExpect(actions.frame.x).toBeGreaterThan(before.frame.x);
    await button('Toggle fixed width').tap();
    const after = (await toolbarItem(
      'First toolbar',
    ).getAttributes()) as IosElementAttributes;
    jestExpect(after.frame.x).toBeGreaterThan(before.frame.x);
    await button('Toggle fixed width').tap();
  });

  it('does not let a preloaded screen change the visible toolbar', async () => {
    await button('Preload other toolbar').tap();
    await expectToolbarItem('First toolbar');
    await expect(toolbarItem('Second toolbar')).not.toExist();
  });

  it('replaces the toolbar owner on push and restores it on pop', async () => {
    await tapToolbarItem('Unread');
    await button('Push other toolbar').tap();
    await expectScreen('Second');
    await expectToolbarItem('Second toolbar');
    await expect(toolbarItem('First toolbar')).not.toExist();
    await button('Go back').tap();
    await expectScreen('First');
    await expectToolbarItem('First toolbar');
    await expect(toolbarItem('Second toolbar')).not.toExist();
    await expectToolbarItem('All');
  });

  it('restores toolbar ownership after native back navigation', async () => {
    await button('Push other toolbar').tap();
    await expectScreen('Second');
    await element(
      by
        .id('chevron.backward')
        .and(by.type('UIImageView'))
        .withAncestor(by.type('RNSStackNavigationBar')),
    ).tap();
    await expectScreen('First');
    await expectToolbarItem('First toolbar');
    await expect(toolbarItem('Second toolbar')).not.toExist();
  });

  itIfiOS26(
    'keeps toolbar ownership after a cancelled gesture and restores it after a pop gesture',
    async () => {
      await button('Push other toolbar').tap();
      await expectScreen('Second');
      await element(by.id('toolbar-screen-root')).swipe(
        'right',
        'slow',
        0.15,
        0.02,
        0.5,
      );
      await expectScreen('Second');
      await expectToolbarItem('Second toolbar');
      await element(by.id('toolbar-screen-root')).swipe(
        'right',
        'fast',
        0.8,
        0.001,
        0.5,
      );
      await expectScreen('First');
      await expectToolbarItem('First toolbar');
      await expect(toolbarItem('Second toolbar')).not.toExist();
    },
  );

  it('hides the toolbar on a screen without items and restores it on pop', async () => {
    const { frame } = (await toolbarItem(
      'Actions',
    ).getAttributes()) as IosElementAttributes;
    jestExpect(
      await renderedActionPixels('toolbar-visible-before-push', frame),
    ).toBeGreaterThan(0);
    await button('Push plain screen').tap();
    await expectScreen('Plain');
    jestExpect(
      await renderedActionPixels('toolbar-hidden-on-plain', frame),
    ).toBe(0);
    await button('Go back').tap();
    await expectScreen('First');
    await expectToolbarItem('First toolbar');
    jestExpect(
      await renderedActionPixels('toolbar-restored-after-pop', frame),
    ).toBeGreaterThan(0);
  });

  it('clears empty, omitted, and unmounted configurations', async () => {
    for (const removal of [
      'Empty items',
      'Omit items',
      'Toggle header config',
    ]) {
      await button(removal).tap();
      await expect(toolbarItem('Actions')).not.toExist();
      await button(
        removal === 'Toggle header config' ? removal : 'Restore items',
      ).tap();
      await expectToolbarItem('First toolbar');
    }
  });

  it('keeps the toolbar independent of navigation bar visibility', async () => {
    await button('Toggle header visibility').tap();
    await expectToolbarItem('First toolbar');
    await button('Toggle header visibility').tap();
    await expectToolbarItem('First toolbar');
  });

  it('renders and removes a custom toolbar item', async () => {
    await button('Toggle custom item').tap();
    await tapToolbarControl(element(by.id('toolbar-custom')));
    await expect(element(by.id('toolbar-last-action'))).toHaveText(
      'Action: Custom',
    );
    await button('Toggle custom item').tap();
    await expect(element(by.id('toolbar-custom'))).not.toExist();
    await expectToolbarItem('First toolbar');
  });
});
