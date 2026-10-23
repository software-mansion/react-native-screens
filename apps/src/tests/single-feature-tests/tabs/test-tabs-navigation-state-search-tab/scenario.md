# Test Scenario: Navigation state on search tab interactions

## Details

**Description:** Verifies that the tabs navigation state progresses exactly
once per selection of a tab with `role: 'search'`, for both user (tab bar) and
programmatic (JS) selections. On iOS 26.1+ the search-role tab is backed by
`UISearchTab`, and UIKit reports both kinds of selection through
`tabBarController:didSelectTab:` - the native side must report user selections
with the `user` origin and must not report its own programmatic selections a
second time.

The search tab here hosts no search controller, so search activation - and the
dropped user selection it led to on iOS 27 (#4855) - is not covered. See the
`test-tabs-search-tab-activation-ios` component integration test for that.

**OS test creation version:** iOS 27.0.

## E2E test

Full: `FabricExample/e2e/single-feature-tests/tabs/test-tabs-navigation-state-search-tab.e2e.ts`
covers all the steps.

## Prerequisites

- iOS simulator or device.

## Note

- Each tab shows two readouts:
  - `Selected in JS: yes/no` - whether the JS tabs state has this tab
    selected,
  - `Last selection: <tab> (<origin>), provenance: <n>` - the payload of the
    last `onTabSelected` event.
- Every selection must advance the provenance by exactly one. A selection that
  never reached JS leaves the readout behind; a duplicated one skips a value.

## Steps

1. Launch the app and navigate to the **Navigation state on search tab
   interactions** screen.

    - [ ] Two tabs are visible: `Home` and the search tab (magnifier icon).

    - [ ] The Home tab shows `Selected in JS: yes` and
          `Last selection: Home (programmatic-js), provenance: 0`.

2. Tap the search tab, then tap `Home`. Repeat 5 times.

    - [ ] After every tap the selected tab shows `Selected in JS: yes`.

    - [ ] After every tap `Last selection` names the selected tab with the
          `user` origin, and the provenance is greater by one than before the
          tap.

3. On Home, tap **Select Search (JS)**. Then, on Search, tap
   **Select Home (JS)**.

    - [ ] Each button selects the other tab, which shows
          `Selected in JS: yes`.

    - [ ] `Last selection` names the selected tab with the `programmatic-js`
          origin, and the provenance grows by one per selection.

4. On Home, tap **Select Search (JS)**, then tap `Home` and the search tab in
   the tab bar.

    - [ ] Each selection advances the provenance by one, with the
          `programmatic-js` origin for the button and `user` for the tab bar taps.
