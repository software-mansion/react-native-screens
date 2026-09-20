import { expect as jestExpect } from '@jest/globals';
import type { IosElementAttributes } from 'detox/detox';
import { by, device, element, expect, waitFor } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

const toolbar = () => element(by.type('UIToolbar'));
const toolbarItem = (title: string) =>
  element(by.label(title).withAncestor(by.type('UIToolbar')));
const button = (title: string) => element(by.text(title));

async function expectScreen(name: string) {
  await waitFor(element(by.id('toolbar-screen-name')))
    .toHaveText(name)
    .withTimeout(3000);
}

describeIfiOS('Stack Toolbar Items (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
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

  it('hides the toolbar on a screen without items and restores it on pop', async () => {
    await button('Push plain screen').tap();
    await expectScreen('Plain');
    await expect(toolbar()).not.toBeVisible();
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
      await expect(toolbar()).not.toBeVisible();
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
    await toolbarItem('Custom action').tap();
    await expect(element(by.id('toolbar-last-action'))).toHaveText(
      'Action: Custom',
    );
    await button('Toggle custom item').tap();
    await expect(toolbarItem('Custom action')).not.toExist();
    await expect(toolbarItem('First')).toBeVisible();
  });
});
