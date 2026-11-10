# Test Scenario: Split stack header and navigation - iOS

## Details

**Description:** `Stack.Host` rendered as the only child of a `Split.Column` becomes the navigator of that column: its header is the column's navigation bar, its header items work as in a standalone stack, and push and pop happen inside the column. Two stack columns side by side.

**OS test creation version:** iPadOS: 27.0

## E2E test

TBD.

## Prerequisites

- iPad simulator or device in landscape, so that both columns are visible.
- The scenario rendered as the root of the app: import `TestSplitStackHeaderNavigation` as `Example` in `apps/App.tsx`. The Split is a top-level navigator, so the scenario is not opened from the tests menu, which pushes it onto a stack.

## Steps

### Layout

1. Start the app with **TestSplitStackHeaderNavigation** as its root.

    - [ ] Two columns are visible, "Primary root" (yellow) and "Secondary root" (blue), each with a navigation bar showing the route name as the title, an "Item" button and a purple box.

### Header items

1. Tap "Item" in the secondary column's navigation bar.

    - [ ] A toast "Secondary item" is displayed.

2. Tap about 10 points next to the purple box in the same bar, outside of the box.

    - [ ] A toast "Secondary custom item" is displayed.

3. Tap about 40 points away from the box, in the empty part of the bar.

    - [ ] No toast is displayed.

4. Repeat steps 1 and 2 in the primary column.

    - [ ] Toasts "Primary item" and "Primary custom item" are displayed.

### Navigation

1. Tap "Push Secondary pushed" in the secondary column.

    - [ ] "Secondary pushed" slides in inside the secondary column only, with a back button and the title "Secondary pushed" in its navigation bar; the primary column does not change.

2. Tap "Push Primary pushed" in the primary column.

    - [ ] "Primary pushed" slides in inside the primary column only.

3. Tap "Pop" in the secondary column, then the back button in the primary column.

    - [ ] Each column shows its root again, with its header items.

### Display mode

1. Tap the display mode button in the navigation bar to hide the primary column, then tap it again to show it.

    - [ ] The secondary stack fills the width while the primary column is hidden and goes back to its column when it is shown; its header items still work.
    - [ ] "Push Primary pushed" in the re-shown primary column still reacts to a tap.
