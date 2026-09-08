import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import {
  createOverflowMenuHelpers,
  describeIfAndroid,
  expectCheckBox,
  expectRadioButton,
  getElementAttributes,
  menuItemRow,
  rewindAndScrollUntilVisible,
  scrollToAndTap,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW } from '../../native-class-names';

// Stateful walkthrough of scenario.md: the menu's checked state is cumulative
// and the screen has no full reset, so each case starts where the previous one
// left off and event counts are absolute. See scenario.md's "Not automated"
// section for what is not covered.

const SCROLLVIEW_ID = 'toolbar-menu-batch-commands-scrollview';
const HEADER_TITLE = 'Toolbar Menu Batch Commands Test';
const SCROLL_STEP = { pixels: 300 };

const EVENT_TIMEOUT_MS = 3000;
// Generous on purpose: the failing-image cases wait on a network error, and a
// slow one must not read as a stuck batch.
const IMAGE_LOAD_TIMEOUT_MS = 90000;

// `by.label` matches the button in both its icon-only (title as content
// description) and text form; the form is told apart by the rendered text.
const appleToolbarButton: NativeMatcher = by
  .label('Apple')
  .and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));

async function expectAppleNotInToolbar() {
  await expect(element(appleToolbarButton)).not.toExist();
}

// Asserted positively: on Android a negated matcher passes on a missing view.
async function expectAppleInToolbarWithIcon() {
  await expect(element(appleToolbarButton)).toBeVisible();
  // AppCompat clears an icon-only action button's text (`setText(null)`).
  await waitFor(element(appleToolbarButton))
    .toHaveText('')
    .withTimeout(IMAGE_LOAD_TIMEOUT_MS);
}

async function expectAppleInToolbarWithoutIcon() {
  await expect(element(appleToolbarButton)).toBeVisible();
  await expect(element(appleToolbarButton)).toHaveText('Apple');
}

async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, SCROLL_STEP);
}

async function tapById(id: string) {
  await scrollToAndTap(id, { scrollViewId: SCROLLVIEW_ID, ...SCROLL_STEP });
}

const { closeMenuIfOpen, withOverflowMenu } = createOverflowMenuHelpers({
  scrollViewId: SCROLLVIEW_ID,
});

async function readText(id: string): Promise<string> {
  await scrollIntoView(id);
  return (await getElementAttributes({ by: 'id', value: id })).text ?? '';
}

async function expectEventCount(n: number, timeoutMs = EVENT_TIMEOUT_MS) {
  await scrollIntoView('events-count-text');
  await waitFor(element(by.id('events-count-text')))
    .toHaveText(`Events received: ${n}`)
    .withTimeout(timeoutMs);
}

async function expectEventCountUnchanged(action: () => Promise<void>) {
  const before = await readText('events-count-text');
  jestExpect(before).toMatch(/^Events received: \d+$/);
  await action();
  await scrollIntoView('events-count-text');
  await expect(element(by.id('events-count-text'))).toHaveText(before);
}

// Parses an event-log entry into group id + ids.
function parseLogEntry(raw: string): { groupId: string; ids: string[] } {
  const text = raw.replace(/^(▶ | {2})/, '');
  const separator = text.indexOf(': ');
  if (separator === -1) {
    throw new Error(`Unrecognized event log entry: "${raw}"`);
  }
  const groupId = text.slice(0, separator);
  const parsed: unknown = JSON.parse(text.slice(separator + 2));
  if (
    !Array.isArray(parsed) ||
    !parsed.every((id): id is string => typeof id === 'string')
  ) {
    throw new Error(`Expected a JSON array of string ids in: "${raw}"`);
  }
  return { groupId, ids: parsed };
}

// Compares ids sorted — order-insensitive, duplicates still fail.
async function expectLogEntry(index: number, groupId: string, ids: string[]) {
  const raw = await readText(`event-log-entry-${index}`);
  const entry = parseLogEntry(raw);
  jestExpect(entry.groupId).toBe(groupId);
  jestExpect([...entry.ids].sort()).toEqual([...ids].sort());
}

async function expectNewestEntry(groupId: string, ids: string[]) {
  await expectLogEntry(0, groupId, ids);
}

async function expectSecondNewestEntry(groupId: string, ids: string[]) {
  await expectLogEntry(1, groupId, ids);
}

describeIfAndroid('Stack Toolbar Menu Batch Commands', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-batch-commands-android',
    );
  });

  afterEach(closeMenuIfOpen);

  describe('baseline — initial render', () => {
    it('renders the header title, initial group states, and a zero event count', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expectEventCount(0);

      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', true);
        await expectCheckBox('Banana', false);
        await expectCheckBox('Cherry', false);
        await expectCheckBox('Date', false);

        await expectRadioButton('List', true);
        await expectRadioButton('Grid', false);
      });
    });
  });

  describe('coalescing — one event per batch', () => {
    it('emits one event for a four-item Select All batch', async () => {
      await tapById('select-all-button');
      await expectEventCount(1);
      await expectNewestEntry('fruits', ['apple', 'banana', 'cherry', 'date']);

      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', true);
        await expectCheckBox('Banana', true);
        await expectCheckBox('Cherry', true);
        await expectCheckBox('Date', true);
      });
    });

    it('emits one event for a four-item Deselect All batch', async () => {
      await tapById('deselect-all-button');
      await expectEventCount(2);
      await expectNewestEntry('fruits', []);

      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', false);
        await expectCheckBox('Banana', false);
        await expectCheckBox('Cherry', false);
        await expectCheckBox('Date', false);
      });
    });
  });

  describe('coalescing — one event per affected group', () => {
    it('emits two events, one per affected group, in update order', async () => {
      await tapById('batch-across-groups-button');
      await expectEventCount(4);
      await expectSecondNewestEntry('fruits', ['cherry']);
      await expectNewestEntry('view', ['grid']);

      await withOverflowMenu(async () => {
        await expectCheckBox('Cherry', true);
        await expectRadioButton('Grid', true);
        await expectRadioButton('List', false);
      });
    });
  });

  describe('single-object (non-array) argument', () => {
    it('treats a single object argument as a one-element batch', async () => {
      await tapById('single-object-update-button');
      await expectEventCount(5);
      await expectNewestEntry('fruits', ['banana', 'cherry']);

      await withOverflowMenu(async () => {
        await expectCheckBox('Banana', true);
        await expectCheckBox('Cherry', true);
      });
    });
  });

  describe('atomic image load with showAsAction', () => {
    it('moves Apple to the toolbar as a plain text button with no icon and no event', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleInToolbarWithoutIcon();
      await withOverflowMenu(async () => {
        await expect(element(menuItemRow('Banana'))).toBeVisible();
        await expect(element(menuItemRow('Apple'))).not.toExist();
      });
    });

    it('emits one event for Deselect All while Apple sits in the toolbar', async () => {
      await tapById('deselect-all-button');
      await expectEventCount(6);
      await expectNewestEntry('fruits', []);
    });

    it('applies the icon and the check together only once the image has loaded', async () => {
      await tapById('batch-image-check-button');
      await expectAppleInToolbarWithIcon();
      await expectEventCount(7);
      await expectNewestEntry('fruits', ['apple', 'cherry']);
    });

    it('moves Apple back to the overflow menu, checked, with no new event', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleNotInToolbar();
      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', true);
      });
    });
  });

  describe('FIFO ordering — a late image must not override a newer command', () => {
    it('emits one event for Deselect All', async () => {
      await tapById('deselect-all-button');
      await expectEventCount(8);
      await expectNewestEntry('fruits', []);
    });

    it('applies the second (synchronous) command last, even though the first image resolves later', async () => {
      await tapById('ordering-race-button');
      await expectEventCount(10, IMAGE_LOAD_TIMEOUT_MS);
      await expectSecondNewestEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', []);

      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', false);
      });
    });
  });

  describe('robustness — a failing image still completes the batch', () => {
    it('applies both commands even though the first image fails to load', async () => {
      await tapById('failing-image-button');
      await expectEventCount(12, IMAGE_LOAD_TIMEOUT_MS);
      await expectSecondNewestEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', ['apple', 'banana']);
    });

    it('shows Apple in the toolbar with its icon cleared by the failed load', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleInToolbarWithoutIcon();
    });

    it('keeps Apple checked in the overflow menu, with no new event', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleNotInToolbar();
      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', true);
      });
    });
  });

  describe('robustness — a repeated id in one batch (last icon wins)', () => {
    it('emits one event for Deselect All', async () => {
      await tapById('deselect-all-button');
      await expectEventCount(13);
      await expectNewestEntry('fruits', []);
    });

    it('moves Apple to the toolbar with no icon and no event', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleInToolbarWithoutIcon();
    });

    it('keeps the check from the first duplicate update and applies the second update’s icon', async () => {
      await tapById('duplicate-id-button');
      await expectEventCount(15, IMAGE_LOAD_TIMEOUT_MS);
      await expectSecondNewestEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', ['apple', 'cherry']);
      await expectAppleInToolbarWithIcon();
    });

    it('keeps Apple checked in the overflow menu, with no new event', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleNotInToolbar();
      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', true);
      });
    });
  });
});
