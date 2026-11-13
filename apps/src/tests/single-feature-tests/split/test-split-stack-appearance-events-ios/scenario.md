# Test Scenario: Split stack appearance events - iOS

## Details

**Description:** A `Split.Column` whose only child is a `Stack.Host` is navigated by that stack. The column's appearance events come from the installed navigation controller, and the stack screens get theirs from UIKit as in a standalone stack. The scenario logs both levels next to a plain column, in a scrollable list that keeps all entries.

**OS test creation version:** iPadOS: 27.0

## E2E test

TBD.

## Prerequisites

- iPad simulator or device in landscape, so that both columns are visible.
- The scenario rendered as the root of the app: import `TestSplitStackAppearanceEvents` as `Example` in `apps/App.tsx`. The Split is a top-level navigator, so the scenario is not opened from the tests menu, which pushes it onto a stack.

## Steps

### First appearance

1. Start the app with **TestSplitStackAppearanceEvents** as its root.

    - [ ] The primary column shows the "Primary StackHost root" screen with a navigation bar, the secondary column shows the buttons and the log on a white background.
    - [ ] The log lists `willAppear` and `didAppear` for "Primary SplitColumn", "Primary StackHost root" and "Secondary SplitColumn".

### Navigation inside the column

1. Tap "Clear log", then "Push Primary StackHost pushed".

    - [ ] "Primary StackHost pushed" slides in inside the primary column, with a back button.
    - [ ] The log lists `Primary StackHost root willDisappear`, `Primary StackHost pushed willAppear`, `Primary StackHost root didDisappear`, `Primary StackHost pushed didAppear`, and nothing for "Primary SplitColumn".

2. Tap "Pop" or the back button.

    - [ ] The log lists the mirrored events of the two screens, and nothing for "Primary SplitColumn".

### Column hidden and shown

1. Tap "Clear log", then "Hide primary".

    - [ ] The primary column slides out.
    - [ ] The log lists `willDisappear` and `didDisappear` for "Primary SplitColumn" and for "Primary StackHost root", nothing for "Secondary SplitColumn".

2. Tap "Show primary".

    - [ ] The log lists `willAppear` and `didAppear` for "Primary SplitColumn" and for "Primary StackHost root".

3. Repeat steps 1 and 2 a few times without clearing the log.

    - [ ] Every cycle adds the same four pairs of events; the list keeps all of them and scrolls.
