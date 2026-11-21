# Test Scenario: ScrollViewMarker - Stack v4 content scroll view

## Details

**Description:** Verifies that a `ScrollViewMarker` registers its
`ScrollView` as the content scroll view of the enclosing Stack v4
(`@react-navigation/native-stack`) screen. The marked `ScrollView` is
rendered after an absolutely positioned background `View`, so it is not
in the first descendant chain of the screen and UIKit cannot find it on
its own. With the registration in place, the large title collapses when
the list is scrolled and the navigation bar applies the marker's `soft`
top edge effect. Covers a pushed screen and a `formSheet` with a
header.

**OS test creation version:** iOS 27.0.

## E2E test

Incomplete: not automated. The checks are visual (large title collapse
and the scroll edge effect under the navigation bar), which Detox
cannot verify.

## Prerequisites

- iOS simulator or device with iOS 26+ for the scroll edge effect. The
  large title collapse can also be checked on older iOS versions.

## Note

- The white background `View` rendered before the marker is
  intentional. It occupies the first descendant chain of the screen.
- Both list screens use `headerLargeTitleEnabled: true`.

## Steps

### Pushed screen

1. Launch the app and navigate to **ScrollViewMarker Integration Tests →
   SVM in Stack v4 - content scroll view**, then tap **Push screen**.

    - [ ] The `Pushed` screen shows a large title above a list of
          coloured full-width rectangles.

2. Scroll the list up.

    - [ ] The large title collapses into the navigation bar as a
          regular, centered title.
    - [ ] The rectangles that pass under the navigation bar fade out
          gradually (`soft` effect), with no dividing line.

3. Scroll back to the very top.

    - [ ] The large title expands again.

---

### formSheet with a header

1. Go back to the home screen and tap **Open formSheet**.

    - [ ] The sheet shows a large `Sheet` title above the list.

2. Scroll the list up.

    - [ ] The large title collapses into the navigation bar of the
          sheet.
    - [ ] The rectangles that pass under the navigation bar fade out
          gradually (`soft` effect).

3. Scroll back to the very top.

    - [ ] The large title expands again.
