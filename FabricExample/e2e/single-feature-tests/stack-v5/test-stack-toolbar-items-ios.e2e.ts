import { expect as jestExpect } from '@jest/globals';
import type { IosElementAttributes } from 'detox/detox';
import { by, device, element, expect, waitFor } from 'detox';
import {
  describeIfiOS,
  headerItem,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const toolbarItem = (title: string) => headerItem(title);
const button = (title: string) => element(by.text(title));

async function expectScreen(name: string) {
  await waitFor(element(by.id('toolbar-screen-name')))
    .toHaveText(name)
    .withTimeout(3000);
}

describeIfiOS('Stack Toolbar Items (iOS)', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-items-ios',
    );
    await expectScreen('First');
  });

  it('updates a native item and dispatches toolbar menu callbacks', async () => {
    await expect(toolbarItem('Unread')).toBeVisible();
    await toolbarItem('Unread').tap();
    await expect(toolbarItem('All')).toBeVisible();
    await expect(element(by.id('toolbar-filter'))).toHaveText('Filter: All');
    await toolbarItem('Actions').tap();
    await button('Archive').tap();
    await expect(element(by.id('toolbar-last-action'))).toHaveText(
      'Action: Archive',
    );
  });

  it('updates a fixed spacer without reversing item order', async () => {
    await toolbarItem('Unread').tap();
    const before = (await toolbarItem(
      'First',
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
      'First',
    ).getAttributes()) as IosElementAttributes;
    jestExpect(after.frame.x).toBeGreaterThan(before.frame.x);
    await button('Toggle fixed width').tap();
  });

  it('does not let a preloaded screen change the visible toolbar', async () => {
    await button('Preload other toolbar').tap();
    await expect(toolbarItem('First')).toBeVisible();
    await expect(toolbarItem('Second')).not.toExist();
  });

  it('replaces the toolbar owner on push and restores it on pop', async () => {
    await toolbarItem('Unread').tap();
    await button('Push other toolbar').tap();
    await expectScreen('Second');
    await expect(toolbarItem('Second')).toBeVisible();
    await expect(toolbarItem('First')).not.toExist();
    await button('Go back').tap();
    await expectScreen('First');
    await expect(toolbarItem('First')).toBeVisible();
    await expect(toolbarItem('Second')).not.toExist();
    await expect(toolbarItem('All')).toBeVisible();
  });

  it('restores toolbar ownership after native back navigation', async () => {
    await button('Push other toolbar').tap();
    await expectScreen('Second');
    await element(by.id('chevron.backward').and(by.type('UIImageView'))).tap();
    await expectScreen('First');
    await expect(toolbarItem('First')).toBeVisible();
    await expect(toolbarItem('Second')).not.toExist();
  });

  it('keeps toolbar ownership after a cancelled gesture and restores it after a pop gesture', async () => {
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
    await expect(toolbarItem('Second')).toBeVisible();
    await element(by.id('toolbar-screen-root')).swipe(
      'right',
      'fast',
      0.8,
      0.02,
      0.5,
    );
    await expectScreen('First');
    await expect(toolbarItem('First')).toBeVisible();
    await expect(toolbarItem('Second')).not.toExist();
  });

  it('hides the toolbar on a screen without items and restores it on pop', async () => {
    await button('Push plain screen').tap();
    await expectScreen('Plain');
    await expect(toolbarItem('Actions')).not.toExist();
    await button('Go back').tap();
    await expectScreen('First');
    await expect(toolbarItem('First')).toBeVisible();
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
      await expect(toolbarItem('First')).toBeVisible();
    }
  });

  it('keeps the toolbar independent of navigation bar visibility', async () => {
    await button('Toggle header visibility').tap();
    await expect(toolbarItem('First')).toBeVisible();
    await button('Toggle header visibility').tap();
    await expect(toolbarItem('First')).toBeVisible();
  });

  it('renders and removes a custom toolbar item', async () => {
    await button('Toggle custom item').tap();
    await element(by.id('toolbar-custom')).tap();
    await expect(element(by.id('toolbar-last-action'))).toHaveText(
      'Action: Custom',
    );
    await button('Toggle custom item').tap();
    await expect(element(by.id('toolbar-custom'))).not.toExist();
    await expect(toolbarItem('First')).toBeVisible();
  });
});
