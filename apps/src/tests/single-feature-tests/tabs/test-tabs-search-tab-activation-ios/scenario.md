# Test Scenario: Search Tab Activation (iOS)

## Details

**Description:** Validates the `ios.automaticallyActivatesSearch` prop on a
tab screen with `systemItem: 'search'`. On iOS 18+ the search tab is backed
by `UISearchTab`; on iOS 26+ UIKit can activate the search controller
mirrored from the header of the stack nested in the tab. The nested stack
is a legacy (v4) `@react-navigation/native-stack` navigator, since the v5
stack does not integrate the search bar into the header yet.

**OS test creation version:** iOS 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator or device running iOS 26 or later for the activation
  behavior; iOS 18-25 for the plain `UISearchTab` rendering checks.

## Note

- Test is iOS-only; `automaticallyActivatesSearch` has no effect on Android.
- On iOS 26+ the search tab bar item renders detached from the other items.
- Cancelling an automatically activated search restores the previously
  selected tab (UIKit behavior).

## Steps

### Rendering & manual activation

1. Launch the app and navigate to the **Search Tab Activation** screen.

- [ ] Two tabs are visible: `Config` and the search tab (magnifier icon).
- [ ] iOS 26+: the search tab bar item is detached from the Config item.
- [ ] The switch on the Config tab is off.

2. Tap the search tab.

- [ ] The nested stack's List screen appears with a search bar in the header.
- [ ] The search field is NOT focused automatically (switch is off).

3. Tap the search field, type a query, then cancel. Return to **Config**.

- [ ] The list filters while typing.
- [ ] Cancel dismisses the keyboard, tab selection does not change.

### Automatic activation (iOS 26+)

4. On the Config tab, enable **automaticallyActivatesSearch**. Tap the
   search tab.

- [ ] The search field activates immediately (keyboard up, field focused).

5. Cancel the search.

- [ ] The previously selected tab (`Config`) becomes selected again.

6. Tap the search tab again, type a query, tap a list item to push
   **Details**, go back with the back gesture, switch to `Config`, then
   reselect the search tab.

- [ ] Activation still focuses the search field of the List screen
  (no stale search controller from the popped screen).

### Prop toggling

7. Disable **automaticallyActivatesSearch** and tap the search tab.

- [ ] The search field is not focused automatically anymore.
