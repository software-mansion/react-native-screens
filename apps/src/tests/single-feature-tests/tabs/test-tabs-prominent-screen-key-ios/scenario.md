# Test Scenario: prominentScreenKey

## Details

**Description:** Validates the iOS `TabsHost` `ios.prominentScreenKey` prop,
which promotes an arbitrary tab to the prominent (detached) treatment on iOS
27+. Verifies that the prominent treatment follows the picked screen key, that
it stays on that tab while the tab bar minimizes, and that promoting the search
tab keeps its search bar working - with `automaticallyActivatesSearch` both on
and off.

**OS test creation version:** iOS 27.2

## E2E test

TBD.

## Prerequisites

- iOS simulator or device running iOS 27.0 or later

## Note

- On iOS 26 and lower the prop has no effect and a warning is logged.
- Values in the picker are the screen keys of the tabs; `undefined` clears the prop.
- The host presets `tabBarMinimizeBehavior: 'onScrollDown'`, the **Cart** tab
  holds the scrollable list used to trigger the minimize.
- The search tab hosts a legacy (v4) native stack with a header search bar that
  filters its list of places. UIKit activates that search bar automatically only
  while the search tab is the prominent one (`automaticallyActivatesSearch` on
  and `prominentScreenKey` is `undefined` or `Search`).
- The Config tab can toggle `automaticallyActivatesSearch` at runtime. With the
  switch off, the search tab behaves like a regular tab.
- The same behavior reproduces in a plain UIKit app without React Native, so it
  is native UIKit behavior and not a react-native-screens issue.

## Steps

1. Launch the app and navigate to the **Prominent Tab Screen Key** screen.

   - [ ] Three tabs are visible: **Config**, **Cart** and the search tab
         (magnifier icon).
   - [ ] **Config** is selected, the `prominentScreenKey` picker reads `undefined`,
         and **automaticallyActivatesSearch** is on.
   - [ ] The search tab bar item is detached from the other items on its own
         surface.

2. Set `prominentScreenKey` = `Cart`.

   - [ ] **Cart** receives the prominent treatment.
   - [ ] The search tab bar item sits with the remaining items.

3. Tap the **Cart** tab.

   - [ ] **Cart** is selected and shows its rows.
   - [ ] The prominent treatment stays on **Cart** while it is selected.

4. Scroll **down** through the list.

   - [ ] The tab bar minimizes.
   - [ ] **Cart** remains visible.

5. Scroll back **up**, switch to **Config** and set
   `prominentScreenKey` = `Search`.

   - [ ] The search tab bar item receives the prominent treatment.
   - [ ] **Cart** sits with the remaining items.

6. Tap the search tab.

   - [ ] The List screen appears.
   - [ ] The search field activates immediately and the keyboard appears.
   - [ ] The tab bar shows the search field and an X button.
   - [ ] The other items disapper.

7. Tap the X button, then tap the **Cart** tab and scroll **down**.

   - [ ] Tapping X closes the search and goes back to **Config**.

   - [ ] The tab bar minimizes.
   - [ ] The search tab bar item remains visible.

8. Scroll back **up**, switch to **Config**, set `prominentScreenKey` =
   `undefined` and turn **automaticallyActivatesSearch** off.

   - [ ] No tab is prominent - all three items sit together.

9. Set `prominentScreenKey` = `Cart`.

   - [ ] **Cart** receives the prominent treatment.

10. Tap the **Cart** tab.

    - [ ] **Cart** is selected and shows its rows.

11. Scroll **down** through the list.

    - [ ] The tab bar minimizes.
    - [ ] **Cart** remains visible next to the minimized tab bar.

12. Scroll back **up**, switch to **Config** and set
    `prominentScreenKey` = `Search`.

    - [ ] The search tab bar item receives the prominent treatment.

13. Tap the search tab.

    - [ ] The List screen appears and its large title stays visible.
    - [ ] The search field in the tab bar is inactive - no keyboard and no X
          button.

14. Tap the **Config** tab, then tap the **Cart** tab and scroll **down**.

    - [ ] The tab bar minimizes.
    - [ ] The search tab bar item remains visible next to the minimized tab bar.
