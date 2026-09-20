import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  getFrame,
  selectSingleFeatureTestsScreen,
  waitUntil,
} from '../../e2e-utils';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '../../native-class-names';

function scenarioNavigationBar() {
  return by
    .type('UINavigationBar')
    .withAncestor(by.id('navigation-item-style-stack'));
}

function navigationBar(title: string) {
  return scenarioNavigationBar().withDescendant(by.text(title));
}

async function layout(title: string) {
  const bar = navigationBar(title);
  return {
    bar: await getFrame(bar),
    title: await getFrame(
      by.type('UILabel').and(by.text(title)).withAncestor(bar),
    ),
    back: await getFrame(
      by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).withAncestor(bar),
    ),
  };
}

function centered(value: Awaited<ReturnType<typeof layout>>) {
  return (
    Math.abs(
      value.title.x + value.title.width / 2 - value.bar.x - value.bar.width / 2,
    ) <
    value.bar.width * 0.05
  );
}

function leadingInRegularWidth(value: Awaited<ReturnType<typeof layout>>) {
  // UIKit retains a centered title in some compact-width layouts. Verify the
  // desktop title layout only when the scenario has regular-width space.
  return (
    value.bar.width < 600 ||
    value.title.x + value.title.width / 2 - value.bar.x < value.bar.width * 0.45
  );
}

let editorBackWidth: number;
let navigatorBackWidth: number;

async function expectNavigator(title: string) {
  await expect(element(navigationBar(title))).toBeVisible();
  await waitUntil(
    async () => {
      const value = await layout(title);
      return centered(value) && value.back.width > editorBackWidth + 15;
    },
    {
      message: `${title} should restore UIKit navigator title and back-button layout`,
    },
  );
}

async function expectEditor() {
  await expect(element(navigationBar('Document'))).toBeVisible();
  await waitUntil(
    async () => {
      const value = await layout('Document');
      return (
        Math.abs(value.back.width - editorBackWidth) < 2 &&
        leadingInRegularWidth(value)
      );
    },
    {
      message:
        'Document should use the editor title layout and chevron-only back button',
    },
  );
}

describeIfiOS('Stack v5: navigationItemStyle', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-navigation-item-style-ios',
    );
  });

  it('applies editor on the initial pushed screen', async () => {
    await element(by.text('Push Document')).tap();
    await expect(element(navigationBar('Document'))).toBeVisible();
    const value = await layout('Document');
    editorBackWidth = value.back.width;
    jestExpect(editorBackWidth).toBeLessThan(60);
    jestExpect(leadingInRegularWidth(value)).toBe(true);
  });

  it('updates all three styles on the visible navigation item', async () => {
    await element(by.text('Set navigator')).tap();
    await expectNavigator('Document');
    navigatorBackWidth = (await layout('Document')).back.width;
    await element(by.text('Set browser')).tap();
    await waitUntil(
      async () => {
        const value = await layout('Document');
        return (
          leadingInRegularWidth(value) &&
          Math.abs(value.back.width - navigatorBackWidth) < 2
        );
      },
      {
        message:
          'Browser should use its title layout and retain the named back button',
      },
    );
    await element(by.text('Set editor')).tap();
    await expectEditor();
  });

  it('restores navigator when the option is removed and keeps adjacent screens independent', async () => {
    await element(by.text('Remove style')).tap();
    await expectNavigator('Document');
    await element(by.text('Set editor')).tap();
    await element(by.text('Push Default')).tap();
    await expectNavigator('Default');
    await element(by.text('Pop Default')).tap();
    await expectEditor();
  });

  it('resets removal and remounting of the header config', async () => {
    await element(by.text('Remove header config')).tap();
    await expect(element(navigationBar('Document'))).not.toExist();
    await element(by.text('Push Default')).tap();
    await expectNavigator('Default');
    await element(by.text('Pop Default')).tap();
    await expect(element(navigationBar('Document'))).not.toExist();
    await element(by.text('Remove style')).tap();
    await element(by.text('Mount header config')).tap();
    await expectNavigator('Document');
  });

  it('starts a fresh instance with its initial editor style', async () => {
    await element(by.text('Pop Document')).tap();
    await element(by.text('Push Document')).tap();
    await expectEditor();
  });

  it('updates and resets styles with an omitted or custom title', async () => {
    const bar = scenarioNavigationBar();
    const back = by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).withAncestor(bar);
    const customTitle = by
      .id('navigation-item-style-custom-title')
      .withAncestor(bar);
    async function expectBackWidth(width: number) {
      await waitUntil(
        async () => Math.abs((await getFrame(back)).width - width) < 2,
        { message: `Back button should have width ${width}` },
      );
    }
    async function expectCustomTitle(navigator: boolean) {
      // Detox reports this rendered UIKit title host as occluded on iOS 26.
      // Check the custom view's bounds in the visible bar and its placement.
      await expect(element(bar)).toBeVisible();
      await expect(element(customTitle)).toExist();
      await waitUntil(
        async () => {
          const value = {
            bar: await getFrame(bar),
            title: await getFrame(customTitle),
            back: await getFrame(back),
          };
          const contained =
            value.title.width === 160 &&
            value.title.height === 24 &&
            value.title.x >= value.bar.x &&
            value.title.y >= value.bar.y &&
            value.title.x + value.title.width <=
              value.bar.x + value.bar.width &&
            value.title.y + value.title.height <=
              value.bar.y + value.bar.height;
          return (
            contained &&
            (navigator ? centered(value) : leadingInRegularWidth(value))
          );
        },
        {
          message: `Custom title should use the ${
            navigator ? 'navigator' : 'editor/browser'
          } layout`,
        },
      );
    }

    await element(by.text('Omit title')).tap();
    await expectBackWidth(editorBackWidth);
    await element(by.text('Set navigator')).tap();
    await expectBackWidth(navigatorBackWidth);
    await element(by.text('Set editor')).tap();
    await expectBackWidth(editorBackWidth);
    await element(by.text('Use custom title')).tap();
    await expectCustomTitle(false);
    await element(by.text('Set navigator')).tap();
    await expectBackWidth(navigatorBackWidth);
    await expectCustomTitle(true);
    await element(by.text('Set browser')).tap();
    await expectBackWidth(navigatorBackWidth);
    await expectCustomTitle(false);
    await element(by.text('Set editor')).tap();
    await expectBackWidth(editorBackWidth);
    await expectCustomTitle(false);
    await element(by.text('Remove style')).tap();
    await expectBackWidth(navigatorBackWidth);
    await expectCustomTitle(true);
    await element(by.text('Use text title')).tap();
    await expectNavigator('Document');
  });
});
