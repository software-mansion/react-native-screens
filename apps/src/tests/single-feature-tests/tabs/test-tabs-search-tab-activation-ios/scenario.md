# Test Scenario: Search Tab Activation (iOS)

## Details

**Description:** Validates the `ios.automaticallyActivatesSearch` prop on a
tab screen with `searchRole: true` (combined with `systemItem: 'search'`
for the item visuals). On iOS 26.1+ the search-role tab is backed by
`UISearchTab` and UIKit can activate the search controller mirrored from
the header of the stack nested in the tab. The nested stack is a legacy
(v4) `@react-navigation/native-stack` navigator, since the v5 stack does
not integrate the search bar into the header yet.

Both screens of the nested stack mount their own search bar (List:
"Search places", Details: "Search in details"), so the scenario also
validates the UIKit hosted-search contract across push and pop: UIKit
hosts (and auto-activates) only the search bar of the ROOT screen of
the search stack, and only while the stack is at its root. A pushed
screen's search bar is a regular in-header search bar; while it is on
top, the tab-hosted search field is removed and reselecting the tab
does not auto-activate anything. Popping back to the root restores the
hosted field and auto-activation.

**OS test creation version:** iOS 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator or device running iOS 26.1 or later

## Note

- iOS-only; `automaticallyActivatesSearch` has no effect on Android.
- UIKit decides the placement of a `UISearchTab` and it differs between OS
  versions (observed on simulators): iOS 26.x renders it detached from the
  other items unconditionally; iOS 27.0 detaches it only while
  `automaticallyActivatesSearch` is enabled.
- Cancelling an automatically activated search restores the previously
  selected tab (UIKit behavior).

## Steps (iOS 27)

### Rendering & manual activation

1. Launch the app and navigate to the **Search Tab Activation** screen.

    - [ ] Two tabs are visible: `Config` and the search tab (magnifier icon).
    
    - [ ] The search tab renders with the system magnifier icon, adjacent to the Config item.
    
    - [ ] The switch on the Config tab is off.

2. Tap the search tab.

    - [ ] The nested stack's List screen appears with a search bar in the header.
    
    - [ ] The search field is NOT focused automatically (switch is off).

3. Tap the search field, type a query, then cancel. Return to **Config**.

    - [ ] The list filters while typing.
    
    - [ ] Cancel dismisses the keyboard, tab selection does not change.

### Automatic activation

4. On the Config tab, enable **automaticallyActivatesSearch**.
    
    - [ ] The search tab moves to the right, with separate platter.

5. Tap the search tab.

    - [ ] The search field activates immediately (keyboard up, field focused).

6. Cancel the search.

    - [ ] The previously selected tab (`Config`) becomes selected again.

### Hosted search across push/pop in the nested stack

7. Tap the search tab again, dismiss the keyboard by dragging the list
   (do not cancel - cancel restores the previous tab), then tap a list
   item to push **Details**.

    - [ ] The push removes the tab-hosted search field (the regular tab
      bar returns).

    - [ ] The Details screen has its own search bar with the
      "Search in details" placeholder in the header.

8. With Details on top, switch to `Config`, then reselect the search tab.

    - [ ] No search activates automatically (the stack is not at its
      root, so there is no hosted search field). The Details screen
      stays visible.

    - [ ] Tapping the "Search in details" field focuses it and typing
      updates the "Typed in the Details search bar" text.

9. Go back to **List** with the back gesture.

    - [ ] The "Search places" field returns to the tab bar area.

10. Switch to `Config`, then reselect the search tab.

    - [ ] Activation focuses the "Search places" field of the List screen
      again (the hosted field re-binds after the pop).

11. Disable **automaticallyActivatesSearch** and tap the search tab.

    - [ ] The search field is not focused automatically anymore.
