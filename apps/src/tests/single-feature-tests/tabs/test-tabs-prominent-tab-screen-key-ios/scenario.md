# Test Scenario: prominentTabScreenKey

## Details

**Description:** Validates the iOS `TabsHost` `ios.prominentTabScreenKey` prop,
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
- Values in the picker are the screen keys of the tabs; `none` clears the prop.
- The host presets `tabBarMinimizeBehavior: 'onScrollDown'`, the **Cart** tab
  holds the scrollable list used to trigger the minimize.
- The search tab hosts a legacy (v4) native stack with a header search bar that
  filters its list of places. UIKit activates that search bar automatically only
  while the search tab is the prominent one (`automaticallyActivatesSearch` on
  and `prominentTabScreenKey` is `none` or `Search`).
- The Config tab can toggle `automaticallyActivatesSearch` at runtime. With the
  switch off, the search tab behaves like a regular tab.
- On iOS 27.2 a prominent search tab looks different depending on whether its
  search is active when the tab is selected:
  - With `automaticallyActivatesSearch` on (`prominentTabScreenKey` is `none` or
    `Search`), selecting the search tab activates the search field right away and
    the tab bar shows a close (X) button next to it.
  - With `automaticallyActivatesSearch` off and `prominentTabScreenKey` =
    `Search`, the search tab is only prominent. Selecting it shows an inactive
    search field in the tab bar, the **List** large title stays visible and there
    is no X button. The X button appears only after tapping the search field.
- The order of the steps matters, because UIKit does not reset the search state
  when switching tabs. Leaving an active search through another tab, instead of
  the X button, keeps the search active. The next visit then shows the X button
  even with `automaticallyActivatesSearch` off. Close the search with the X
  button, or reload the app, before checking the "only prominent" case.
- The same behavior reproduces in a plain UIKit app without React Native, so it
  is native UIKit behavior and not a react-native-screens issue.

## Steps

1. Launch the app and navigate to the **Prominent Tab Screen Key** screen.

   - [ ] Three tabs are visible: **Config**, **Cart** and the search tab
         (magnifier icon).
   - [ ] **Config** is selected, the `prominentTabScreenKey` picker reads `none`,
         and **automaticallyActivatesSearch** is on.
   - [ ] The search tab bar item is detached from the other items on its own
         surface.

2. Set `prominentTabScreenKey` = `Cart`.

   - [ ] **Cart** receives the prominent treatment.
   - [ ] The search tab bar item sits with the remaining items.

3. Tap the **Cart** tab.

   - [ ] **Cart** is selected and shows its rows.
   - [ ] The prominent treatment stays on **Cart** while it is selected.

4. Scroll **down** through the list.

   - [ ] The tab bar minimizes.
   - [ ] **Cart** remains visible next to the minimized tab bar.

5. Scroll back **up**, switch to **Config** and set
   `prominentTabScreenKey` = `Search`.

   - [ ] The search tab bar item receives the prominent treatment.
   - [ ] **Cart** sits with the remaining items.

6. Tap the search tab.

   - [ ] The List screen appears.
   - [ ] The search field activates immediately.

7. Tap the **Config** tab, then tap the **Cart** tab and scroll **down**.

   - [ ] The tab bar minimizes.
   - [ ] The search tab bar item remains visible.

8. Scroll back **up**, switch to **Config**, set `prominentTabScreenKey` =
   `none` and turn **automaticallyActivatesSearch** off.

   - [ ] No tab is prominent - all three items sit together.

9. Set `prominentTabScreenKey` = `Cart`.

   - [ ] **Cart** receives the prominent treatment.

10. Tap the **Cart** tab.

    - [ ] **Cart** is selected and shows its rows.

11. Scroll **down** through the list.

    - [ ] The tab bar minimizes.
    - [ ] **Cart** remains visible next to the minimized tab bar.

12. Scroll back **up**, switch to **Config** and set
    `prominentTabScreenKey` = `Search`.

    - [ ] The search tab bar item receives the prominent treatment.

13. Tap the search tab.

    - [ ] The List screen appears with
    - [ ] The search field are open.

14. Tap the **Config** tab, then tap the **Cart** tab and scroll **down**.

    - [ ] The tab bar minimizes.
    - [ ] The search tab bar item remains visible next to the minimized tab bar.
