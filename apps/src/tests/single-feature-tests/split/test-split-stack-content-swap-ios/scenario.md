# Test Scenario: Split stack content swap - iOS

## Details

**Description:** The content of a `Split.Column` is swapped at runtime between a plain view and a `Stack.Host`, and between two different `Stack.Host` instances. A column gets a separate navigation controller for each kind of content, so every swap makes the Split install a new one. The primary column holds the controls and a log of the appearance events of the secondary column.

**OS test creation version:** iPadOS: 27.0

## E2E test

TBD.

## Prerequisites

- iPad simulator or device in landscape, so that both columns are visible.
- The scenario rendered as the root of the app: import `TestSplitStackContentSwap` as `Example` in `apps/App.tsx`. The Split is a top-level navigator, so the scenario is not opened from the tests menu, which pushes it onto a stack.

## Steps

### Plain view

1. Start the app with **TestSplitStackContentSwap** as its root.

    - [ ] The secondary column shows "Plain view" on a green background, with a pressable box.
    - [ ] No error is logged in development.

2. Tap the box in the secondary column.

    - [ ] The box reacts to the tap.

### Plain view to a stack

1. Tap "Clear log", then "Stack A".

    - [ ] The secondary column shows "Stack A root" on a yellow background, with a navigation bar titled "Stack A root". Nothing flickers and the column does not stay empty.
    - [ ] No error is logged in development.

2. Tap the box in the secondary column, then "Push Stack A pushed", then the box again.

    - [ ] The box reacts to both taps, and "Stack A pushed" slides in inside the secondary column with a back button.

### A stack to another stack

1. Tap "Clear log", then "Stack B".

    - [ ] The secondary column shows "Stack B root" on a blue background, with the title "Stack B root" and no back button.

2. Tap "Push Stack B pushed", then "Pop".

    - [ ] The push and the pop happen inside the secondary column.

### A stack to the plain view

1. Tap "Clear log", then "Plain view".

    - [ ] The secondary column shows "Plain view" again, laid out in the whole column, and the box reacts to a tap.

### Repeated swaps

1. Tap "Stack A", "Plain view", "Stack B", "Stack A" and "Plain view", one after another.

    - [ ] After every tap the secondary column shows the selected content.
    - [ ] The display mode button of the secondary column still hides and shows the primary column.

### Appearance events

1. Look at the log after each swap of the steps above.

    - [ ] Note which appearance events of the secondary column a swap emits. The navigation controller of the column is replaced, so `willAppear` and `didAppear` are expected; a `willDisappear` or `didDisappear` without a matching appear event is a bug.
