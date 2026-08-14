// Detox cannot read the bytes of a remotely loaded image, so every
// image-load case below asserts only whether Apple's toolbar icon view
// exists — that *a* photo (or none, for a failed/cleared load) was
// applied — never that the downloaded content is the correct photo, and
// never that the icon and its coalesced event land at the exact same
// instant. See scenario.md's "Not automated" note.
import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes, NativeMatcher } from 'detox/detox';
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
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
} from '../../native-class-names';

// Runs the whole scenario.md walkthrough as one continuous, stateful script:
// "Reset log clears only the counter and log, not the menu" — so every case
// below starts from the checked/toolbar state the previous one left.

const SCROLLVIEW_ID = 'toolbar-menu-batch-commands-scrollview';
const HEADER_TITLE = 'Toolbar Menu Batch Commands Test';

// The image cases download a large, uncached image over the network (or hit
// an always-failing host), so the async load is visibly slow — see
// scenario.md's Prerequisites and Note.
const IMAGE_LOAD_TIMEOUT_MS = 30000;

// Matched by accessibility label, not visible text: once an icon is applied
// the row may show only the icon, but the label still carries the title.
const appleToolbarButton: NativeMatcher = by
  .label('Apple')
  .and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));

const appleToolbarIcon: NativeMatcher = by
  .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
  .withAncestor(appleToolbarButton);

async function expectAppleInToolbar() {
  await expect(element(appleToolbarButton)).toBeVisible();
}

async function expectAppleNotInToolbar() {
  await expect(element(appleToolbarButton)).not.toExist();
}

// Existence-only, per the file header note: proves an icon view was (or
// wasn't) mounted, not that its pixels are the correct photo.
async function expectAppleToolbarIcon(present: boolean) {
  if (present) {
    await expect(element(appleToolbarIcon)).toBeVisible();
  } else {
    await expectAppleInToolbar();
    await expect(element(appleToolbarIcon)).not.toExist();
  }
}

// The small step keeps short rows from being scrolled past.
const SETTINGS_CONTROL = { scrollViewId: SCROLLVIEW_ID, pixels: 300 };

// Rewinds to the top first, so a target above the current offset is still
// reachable — `whileElement` only scrolls one way.
async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, SETTINGS_CONTROL);
}

async function tapById(id: string) {
  await scrollToAndTap(id, SETTINGS_CONTROL);
}

const { closeMenuIfOpen, withOverflowMenu } = createOverflowMenuHelpers({
  scrollViewId: SCROLLVIEW_ID,
});

async function readText(id: string): Promise<string> {
  await scrollIntoView(id);
  const attrs = (await getElementAttributes({
    by: 'id',
    value: id,
  })) as AndroidElementAttributes;
  return attrs.text ?? '';
}

async function expectEventCount(n: number) {
  await scrollIntoView('events-count-text');
  await expect(element(by.id('events-count-text'))).toHaveText(
    `Events received: ${n}`,
  );
}

// For the image-load cases: the count settles only once the async command
// queue drains, which can take a while over the network.
async function waitForEventCount(n: number, timeoutMs: number) {
  await scrollIntoView('events-count-text');
  await waitFor(element(by.id('events-count-text')))
    .toHaveText(`Events received: ${n}`)
    .withTimeout(timeoutMs);
}

// The baseline is read rather than written into the test, so an `it` is not
// coupled to the outcome of the one before it.
async function expectEventCountUnchanged(action: () => Promise<void>) {
  const before = await readText('events-count-text');
  await action();
  await scrollIntoView('events-count-text');
  await expect(element(by.id('events-count-text'))).toHaveText(before);
}

// Payload order is a native implementation detail — compare ids as a set, the
// same way the sibling toolbar-menu-disabled spec's `expectLastSelection` does.
function parseLogEntry(raw: string): { groupId: string; ids: string[] } {
  const text = raw.replace(/^(▶ | {2})/, '');
  const separator = text.indexOf(': ');
  if (separator === -1) {
    throw new Error(`Unrecognized event log entry: "${raw}"`);
  }
  const groupId = text.slice(0, separator);
  const parsed: unknown = JSON.parse(text.slice(separator + 2));
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected a JSON array of ids in: "${raw}"`);
  }
  return { groupId, ids: parsed as string[] };
}

async function expectLogEntry(index: number, groupId: string, ids: string[]) {
  const raw = await readText(`event-log-entry-${index}`);
  const entry = parseLogEntry(raw);
  jestExpect(entry.groupId).toBe(groupId);
  jestExpect([...entry.ids].sort()).toEqual([...ids].sort());
}

async function expectNewestEntry(groupId: string, ids: string[]) {
  await expectLogEntry(0, groupId, ids);
}

// Only meaningful right after a two-event batch — index 1 is one entry older
// than "newest", i.e. the first of the two events the batch produced.
async function expectPreviousEntry(groupId: string, ids: string[]) {
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

  // Covers taps made outside a `withOverflowMenu` block: a case that fails
  // mid-menu must not leave the popup up and take every later case down too.
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
      await expectPreviousEntry('fruits', ['cherry']);
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

      await expectAppleInToolbar();
      await expectAppleToolbarIcon(false);
      await withOverflowMenu(async () => {
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
      await waitForEventCount(7, IMAGE_LOAD_TIMEOUT_MS);
      await expectNewestEntry('fruits', ['apple', 'cherry']);
      await expectAppleToolbarIcon(true);
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
      await waitForEventCount(10, IMAGE_LOAD_TIMEOUT_MS);
      await expectPreviousEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', []);

      await withOverflowMenu(async () => {
        await expectCheckBox('Apple', false);
      });
    });
  });

  describe('robustness — a failing image still completes the batch', () => {
    it('applies both commands even though the first image fails to load', async () => {
      await tapById('failing-image-button');
      await waitForEventCount(12, IMAGE_LOAD_TIMEOUT_MS);
      await expectPreviousEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', ['apple', 'banana']);
    });

    it('shows Apple in the toolbar with its icon cleared by the failed load', async () => {
      await expectEventCountUnchanged(async () => {
        await tapById('toggle-apple-button');
      });

      await expectAppleInToolbar();
      await expectAppleToolbarIcon(false);
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

      await expectAppleInToolbar();
      await expectAppleToolbarIcon(false);
    });

    it('keeps the check from the first duplicate update and applies the second update’s icon', async () => {
      await tapById('duplicate-id-button');
      await waitForEventCount(15, IMAGE_LOAD_TIMEOUT_MS);
      await expectPreviousEntry('fruits', ['apple']);
      await expectNewestEntry('fruits', ['apple', 'cherry']);
      await expectAppleToolbarIcon(true);
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
