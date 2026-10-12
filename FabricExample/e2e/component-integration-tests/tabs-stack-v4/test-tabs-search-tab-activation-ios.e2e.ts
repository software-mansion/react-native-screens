import { device, expect, element, by } from 'detox';
import type {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';
import { selectComponentIntegrationTestsScreen } from '../../e2e-utils';
import { CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26 } from '../../native-class-names';
import isVersionEqualOrHigherThan from '../../helpers/isVersionEqualOrHigherThan';

const {
  getIOSVersionNumber,
} = require('../../../../scripts/e2e/ios-devices.js');

const DEFAULT_TIMEOUT_MS = 3000;

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

type Frame = ElementAttributes['frame'];

type MatchOptions = {
  /**
   * Resolve to no matches instead of throwing. Pass only where absence is an
   * expected state — it also swallows a crashed app and a dropped connection.
   */
  orEmpty?: boolean;
};

type ScrollOptions = {
  /** Pixels per step. Smaller steps avoid overshooting a short row. */
  pixels?: number;
  /** Swipe start, as a fraction of height. Keep it inside the view: on
   * Android a `NaN`/0 start lands in the status bar and opens the shade. */
  startPercentage?: number;
  /** Scroll direction; `whileElement` only ever scrolls one way. */
  direction?: 'up' | 'down';
};

/** A scroll view plus the tuning used to bring one of its rows into view. */
type ScrollTargetOptions = ScrollOptions & { scrollViewId: string };

/** `to` is the state expected afterwards — a swallowed tap fails here, once
 * the wait below is exhausted. Omit `control` on screens whose switches sit
 * outside any scroll view. */
type SwitchToggle = {
  switchId: string;
  /** The switch's `label` prop. */
  label: string;
  /** The state expected after the tap. */
  to: boolean;
};

async function getMatches(
  matcher: NativeMatcher,
  { orEmpty = false }: MatchOptions = {},
): Promise<ElementAttributes[]> {
  try {
    const attrs = await element(matcher).getAttributes();
    return 'elements' in attrs ? attrs.elements : [attrs];
  } catch (error) {
    if (orEmpty) {
      return [];
    }
    throw error;
  }
}

function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

/**
 * Coordinate tap at (`xFraction`, 1/2) of `frame`, bypassing visibility
 * checks. Rounded: Detox's iOS runner parses each coordinate as an integer and
 * silently falls back to 100 for a fractional one.
 */
async function tapWithinFrame({ x, y, width, height }: Frame, xFraction = 0.5) {
  await device.tap({
    x: Math.round(x + width * xFraction),
    y: Math.round(y + height / 2),
  });
}

async function scrollUntilVisible(
  id: string,
  scrollViewId: string,
  {
    pixels = 600,
    startPercentage = 0.85,
    direction = 'down',
  }: ScrollOptions = {},
) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixels, direction, Number.NaN, startPercentage);
}

/**
 * Rewinds to the top first — `whileElement` only scrolls one way. Down only:
 * rewinding to the top makes an upward scan pointless, so `direction` is
 * rejected at the type level.
 */
async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: Omit<ScrollOptions, 'direction'> = {},
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, options);
}

async function toggleSettingsSwitch(
  { switchId, label, to }: SwitchToggle,
  control?: ScrollTargetOptions,
) {
  if (control) {
    const { scrollViewId, ...scroll } = control;
    await rewindAndScrollUntilVisible(switchId, scrollViewId, scroll);
  }
  await element(by.id(switchId)).tap();

  // Waited, not asserted once: the label is re-rendered from the switch's new
  // state, which Detox's idle sync does not always cover.
  await waitFor(element(by.text(`${label}: ${to}`)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

// `UISearchTab` (and with it search activation and the collapsed tab bar) is
// used only on the `UITab` API path, enabled from iOS 26.1.
const describeIfUISearchTab = isIOSVersionAtLeast('26.1')
  ? describe
  : describe.skip;

// Once the search tab has been activated, UIKit lets a mount transaction run
// between `shouldSelectTab:` and `didSelectTab:` on every later selection of
// it (observed on iOS 27), so a single round trip is not enough.
const SELECTION_ROUNDS = 5;

/**
 * With the search active, UIKit shows the other tabs as a single collapsed
 * button. It has no `testID` (the regular, hidden button keeps it) and is
 * told apart by its accessibility value.
 */
async function tapCollapsedTabButton(label: string) {
  const buttons = (await getMatches(
    by.label(label).and(by.type(CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26)),
  )) as IosElementAttributes[];
  const collapsedButton = buttons.find(button => button.value === 'Collapsed');
  if (collapsedButton === undefined) {
    throw new Error(`No collapsed tab button labeled "${label}"`);
  }
  await tapWithinFrame(collapsedButton.frame);
}

describeIfUISearchTab('Stack v4 & Tabs: search tab activation', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectComponentIntegrationTestsScreen(
      'Stack V4 & Native Tabs Integration Tests',
      'test-tabs-search-tab-activation-ios',
    );
  });

  it('should keep the JS selection in sync when returning through the collapsed tab bar', async () => {
    await toggleSettingsSwitch({
      switchId: 'automatically-activates-search-switch',
      label: 'automaticallyActivatesSearch',
      to: true,
    });

    for (let round = 0; round < SELECTION_ROUNDS; round++) {
      await element(by.id('search-tab-item')).tap();
      await expect(
        element(by.id('search-list-selected-in-js-label')),
      ).toHaveLabel('Selected in JS: yes');

      // The activated search field brings up the keyboard, which covers the
      // collapsed tab bar.
      await element(by.id('search-list-scrollview')).swipe('down', 'slow', 0.3);
      await tapCollapsedTabButton('Config');
      await expect(element(by.text('Search Tab Activation'))).toBeVisible();
    }
  });
});
