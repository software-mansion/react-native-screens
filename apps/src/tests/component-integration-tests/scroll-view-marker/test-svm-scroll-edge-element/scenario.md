# Test Scenario: ScrollViewMarker - ScrollEdgeElement

## Details

**Description:** Verifies that views wrapped in `ScrollEdgeElement` get the
scroll edge effect of the `ScrollViewMarker`'s `ScrollView` they float
over. The screen shows a long marked `ScrollView` running under the status
bar and home indicator (`scrollEdgeEffects={{ top: 'soft', bottom: 'soft' }}`),
a full-width custom header pinned to its top edge and a full-width custom
footer pinned to its bottom edge.
Neither is a system bar, so without the wrapper UIKit draws no edge effect
under them. The same screen is rendered with no container, in Stack v4,
in Stack v5, in Tabs and in JS bottom tabs (`ScreenContainer`).
**stack-v4-native-header** replaces the custom header with a transparent
native one, as a reference for the effect under a system bar. **Toggle**
switches the header and footer between `ScrollEdgeElement` and a plain
`View`.

**OS test creation version:** iOS 27.0.

## E2E test

Incomplete: not automated. The checks are visual (the scroll edge effect
under the header and footer), which Detox cannot verify.

## Prerequisites

- iOS simulator or device with iOS 26+. On older versions the wrapper
  renders a plain view and there is nothing to check.

## Steps

### No container

1. Launch the app and navigate to **ScrollViewMarker Integration Tests →
   SVM with ScrollEdgeElement**, then tap **none**.

    - [ ] The screen shows a list of coloured rows, a `Custom header` row
          at the top and a footer reading `ScrollEdgeElement` at the
          bottom.

2. Scroll the list up and down.

    - [ ] The rows that pass under the footer and the header fade out
          gradually (`soft` effect) around the header and footer
          contents.

3. Tap **Toggle**. The footer reads `Plain View`. Scroll again.

    - [ ] The rows stay sharp under the header and footer.

4. Tap **Toggle** again, scroll again.

    - [ ] The edge effect is back.

5. Tap **Close**.

---

### Stack v4, Stack v5, Tabs and JS bottom tabs

1. Repeat the steps above after tapping **stack-v4**, **stack-v5**,
   **tabs** and **js-tabs**.

    - [ ] The results match the ones with no container. In Stack v4 and JS
          bottom tabs this needs #5014; without it the screen resets the
          marker's effects to `automatic` (hard on iOS 27) when it is
          attached.
    - [ ] In Tabs and JS bottom tabs, switching to the **Other** tab and
          back keeps the effect on both tabs. The footer sits behind the tab
          bar there, so check the header.

---

### Native header reference

1. Tap **stack-v4-native-header** and scroll.

    - [ ] Rows fade out softly under the transparent native header. Compare
          its extent with the custom header in **none**.
