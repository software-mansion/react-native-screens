# Test Scenario: Tab Bar Item Badge

## Details

**Description:** Validates the `badgeValue` prop on `TabsScreen` and the
badge appearance props (`tabBarItemBadgeBackgroundColor` and Android only: `tabBarItemBadgeTextColor`). The scenario covers
four badge cases: a badge with default system appearance, a
long numeric string that overflows the max display width, a custom string
badge, and an emoji badge. For iOS, it also exercises
`scrollEdgeAppearance` badge color. On Android, all badge color
customisation is driven by `standardAppearance`.

**OS test creation version:** iOS: 18.6 and iOS 26.5, Android: API Level 36.

## E2E test

Incomplete: Only step 1 for iOS is automated. The E2E test asserts the badge text
values for all four tabs at baseline. A single suite can be run on both iOS
versions with version-specific conditions: the tab bar badge view class name
resolves dynamically (_UIBadgeView on iOS 18 and lower vs.
_UIBarBadgeView on iOS 26).

Not covered:

- Android - no automated coverage; all badge behavior on Android remains
  manual-only.
- Badge background color and badge text color (all tabs, all states) -
  Detox does not expose color attributes of native tab bar badge views,
  so color assertions require a screenshot-diff approach not yet in place.

## Prerequisites

- iOS device or simulator.
- Android emulator.

## Note

`badgeValue`:

- On Android the maximum badge string length rendered verbatim is 4
  characters; longer numeric strings are capped and shown as `999+`.
  When `badgeValue` is set to an empty string it renders as "small dot" badge if
  `tabBarItemBadgeBackgroundColor` is not `transparent`.
- On iOS 18: badges render the full `badgeValue` string without truncation;
because the badge text color is white, any characters overflowing the badge's colored
background will blend into a white screen background and become invisible.
- On iOS 26: long badges render the `badgeValue` string with truncation, ending with "...".

`tabBarItemBadgeBackgroundColor`:

- Setting a transparent `tabBarItemBadgeBackgroundColor` removes the badge's pill
background. On iOS, only the selected tab's badgeValue floats without a colored
background, while the background color of unselected badges remains visible.
On Android, this property makes the background fully transparent for all tabs,
effectively making Tab1 appear badgeless.
- On iOS 26 ([KI 1072](https://github.com/software-mansion/react-native-screens-labs/issues/1072))
When `tabBarItemBadgeBackgroundColor` is defined with different colors for the
normal and selected states, the badge color of the selected tab breaks and
partially uses the normal state's background color. Additionally, if a tab on
the left side has a long badge value, it can be affected as well, causing its
color to partially break and incorrectly inherit the selected state's background color.

---

## Steps (iOS)

### Baseline

1. Launch the app and navigate to the **Tab Bar Item Badge** screen.

- [ ] Four tabs are visible - **Tab1**, **Tab2**, **Tab3**, **Tab4**.
- [ ] Tab1 is active. Each tab shows a badge in the tab bar.
- [ ] Tab1: badge reads **1**.
- [ ] Tab2: on iOS 26 badge reads **12345...**; on iOS 18 **23456789** is visible.
- [ ] Tab3's badge reads **NEW!**.
- [ ] Tab4's badge reads **⚠️**.

---

### Tab1 - default badge appearance

2. Confirm Tab1 is active. Observe the Tab1 badge in the tab bar.

- [ ] Badge shows **1**.
- [ ] The badge renders with the iOS system default: red background with white text.

---

### Tab2 - long badge value and scrollEdgeAppearance

3. Tap **Tab2** in the tab bar.

- [ ] Tab2 is selected. The badge in the tab bar reads:
  - on iOS 26 badge reads **12345...**;
  - on iOS 18 **23456789** is visible.
- [ ] The badge pill is blue.

4. iOS 26 only: Scroll the Tab2 content all the way to the bottom until the scroll
   edge meets the tab bar.

- [ ] The badge pill color transitions from blue to yellow for all tabs.

5. iOS 26 only: Scroll back up so the content edge no longer touches the tab bar.

- [ ] The badge pill returns to blue.

---

### Tab3 - string badge value and normal/selected state colors

6. Tap **Tab3** in the tab bar.

- [ ] Tab3 is selected. The badge in the tab bar reads **NEW!**.
- [ ] The selected tab badge pill is blue, other tabs badges pills are purple.
- [ ] On iOS 26 selected badge pill color is divided into selected (blue) and
normal (purple), also Tab2 badge is affected and its badge color is partially blue
(see KI from Note section)

---

### Tab4 - emoji badge and transparent selected state

7. Tap **Tab4** in the tab bar.

- [ ] Tab4 is selected. The badge in the tab bar shows **⚠️**.
- [ ] The selected state has `tabBarItemBadgeBackgroundColor: transparent`,
  so the badge background is invisible - the emoji floats without a
  colored pill.
- [ ] The badge background for unselected tabs is default red.

---

### Stability check

8. Cycle through all four tabs in order (Tab1 → Tab2 → Tab3 → Tab4),
    then in reverse (Tab4 → Tab3 → Tab2 → Tab1).

- [ ] Each badge updates correctly for the selected vs. unselected state on every tab switch.

---

## Steps (Android)

### Baseline

1. Launch the app and navigate to the **Tab Bar Item Badge** screen.

- [ ] Four tabs are visible - **Tab1**, **Tab2**, **Tab3**, **Tab4**.
- [ ] Tab1 is active. Each tab shows a badge in the tab bar.
- [ ] Tab1: small dot is visible as badge value is set to an empty string.
- [ ] Tab2's badge is capped at **999+** (the string "1234567890" exceeds the
maximum and is truncated by the system).
- [ ] Tab3's badge reads **NEW!**.
- [ ] Tab4's badge reads **⚠️**.

---

### Tab1 - default badge appearance

2. Confirm Tab1 is active. Observe the Tab1 badge in the tab bar.

- [ ] Badge shows as a small dot.
- [ ] The badge renders with the Android system default: red background with white text.

---

### Tab2 - long badge value and custom colors

3. Tap **Tab2** in the tab bar.

- [ ] Tab2 is selected. The badge in the tab bar is shown
  as **999+**.
- [ ] The badge background is blue and the badge text is
  yellow for all tabs.

---

### Tab3 - string badge value and custom colors

4. Tap **Tab3** in the tab bar.

- [ ] Tab3 is selected. The badge in the tab bar reads **NEW!**.
- [ ] The badge background is purple and the badge text is navy for all tabs.

---

### Tab4 - emoji badge and transparent background

5. Tap **Tab4** in the tab bar.

- [ ] Tab4 is selected. The badge in the tab bar shows emoji **⚠️**.
- [ ] The badge background is transparent for all tabs, so the emoji and text
floats without a colored pill.
- [ ] The badge text color is red.

---

### Stability check

6. Cycle through all four tabs in order (Tab1 → Tab2 → Tab3 → Tab4),
   then in reverse (Tab4 → Tab3 → Tab2 → Tab1).

- [ ] Each badge is displayed correctly on every tab switch. The colors, text
values, and transparent states remain stable.
