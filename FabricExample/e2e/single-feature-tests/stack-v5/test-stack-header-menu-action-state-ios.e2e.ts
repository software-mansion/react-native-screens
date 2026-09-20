import { by, device, element, expect } from 'detox';
import {
  checkmarkFor,
  CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
  contextMenu,
  describeIfiOS,
  dismissContextMenu,
  headerItem,
  menuRowMatcher,
  openContextMenu,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const openMenu = () => openContextMenu(headerItem('Format'));
const mixedIndicatorFor = (title: string) =>
  element(by.id('minus').withAncestor(menuRowMatcher(title)));

describeIfiOS('Stack Header Menu Action State (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-action-state-ios',
    );
  });

  it('presents checked and mixed actions without native toggle callbacks or state changes on tap', async () => {
    await openMenu();
    await expect(checkmarkFor('Bold')).toBeVisible();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await expect(checkmarkFor('Notifications')).not.toExist();
    await element(by.text('Bold')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 1');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 0; IDs: none',
    );
    await openMenu();
    await expect(checkmarkFor('Bold')).toBeVisible();
    await element(by.text('Italic')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 2');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 0; IDs: none',
    );
    await openMenu();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await dismissContextMenu();
  });

  it('follows application changes through mixed, off, and on', async () => {
    await element(by.id('cycle-state')).tap();
    await openMenu();
    await expect(mixedIndicatorFor('Bold')).toBeVisible();
    await dismissContextMenu();
    await element(by.id('cycle-state')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).not.toExist();
    await expect(mixedIndicatorFor('Bold')).not.toExist();
    await dismissContextMenu();
    await element(by.id('cycle-state')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).toBeVisible();
    await dismissContextMenu();
  });

  it('keeps native toggles and automatic radio items under the existing tracker', async () => {
    await openMenu();
    await element(by.text('Notifications')).tap();
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 1; IDs: notifications',
    );
    await openMenu();
    await expect(checkmarkFor('Notifications')).toBeVisible();
    await element(by.text('Notifications')).tap();
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 2; IDs: none',
    );
    await openMenu();
    await element(by.text('Alignment')).tap();
    await expect(checkmarkFor('Leading')).not.toExist();
    await expect(checkmarkFor('Trailing')).toBeVisible();
    await element(by.text('Leading')).tap();
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 3; IDs: leading',
    );
    await expect(element(by.id('press-count'))).toHaveText('Presses: 2');
    await element(by.id('command-toggle')).tap();
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 4; IDs: notifications',
    );
    await openMenu();
    await expect(checkmarkFor('Notifications')).toBeVisible();
    await element(by.text('Alignment')).tap();
    await expect(checkmarkFor('Leading')).toBeVisible();
    await expect(checkmarkFor('Trailing')).not.toExist();
    await dismissContextMenu();
  });

  it('supports existing commands, preserves omitted state, resets explicit undefined, and rebuilds same IDs', async () => {
    await element(by.id('command-mixed')).tap();
    await element(by.id('command-title')).tap();
    await openMenu();
    await expect(mixedIndicatorFor('Bold text')).toBeVisible();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await dismissContextMenu();
    await element(by.id('command-reset')).tap();
    await openMenu();
    await expect(mixedIndicatorFor('Bold text')).not.toExist();
    await expect(checkmarkFor('Bold text')).not.toExist();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await dismissContextMenu();
    await element(by.id('rebuild-menu')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).toBeVisible();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await expect(checkmarkFor('Notifications')).not.toExist();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 2');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 4; IDs: notifications',
    );
    await dismissContextMenu();
  });

  it('clears omitted states and follows current definitions after menu removal', async () => {
    await element(by.id('toggle-states')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).not.toExist();
    await expect(mixedIndicatorFor('Italic')).not.toExist();
    await dismissContextMenu();
    await element(by.id('toggle-menu')).tap();
    await headerItem('Format').tap();
    // A negative waitFor returns immediately while presentation is still pending.
    await new Promise(resolve =>
      setTimeout(resolve, CONTEXT_MENU_ANIMATION_TIMEOUT_MS),
    );
    await expect(contextMenu()).not.toExist();
    await element(by.id('toggle-menu')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).not.toExist();
    await expect(mixedIndicatorFor('Italic')).not.toExist();
    await dismissContextMenu();
    await element(by.id('toggle-states')).tap();
    await openMenu();
    await expect(checkmarkFor('Bold')).toBeVisible();
    await expect(mixedIndicatorFor('Italic')).toBeVisible();
    await dismissContextMenu();
  });
});
