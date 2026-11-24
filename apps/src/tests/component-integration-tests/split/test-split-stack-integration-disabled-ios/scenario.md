# Test Scenario: Split stack integration disabled - iOS

## Details

**Description:** `disableStackIntegration` on a `Split.Column` keeps the column a plain one even though its only child is a `Stack.Host`. The stack is nested in the column like any other content: the column keeps its own navigation controller and frame, the stack mounts inside it with its own navigation bar.

**OS test creation version:** iPadOS: 27.0

## E2E test

TBD.

## Prerequisites

- iPad simulator or device in landscape, so that both columns are visible.
- The scenario rendered as the root of the app: import `TestSplitStackIntegrationDisabled` as `Example` in `apps/App.tsx`. The Split is a top-level navigator, so the scenario is not opened from the tests menu, which pushes it onto a stack.

## Steps

1. Start the app with **TestSplitStackIntegrationDisabled** as its root.

    - [ ] The primary column shows the "Nested root" screen with the stack's navigation bar placed inside the column, below the area of the column's own bar; the secondary column shows "Plain column".
    - [ ] No error is logged in development.

2. Tap "Push Nested pushed", then "Pop".

    - [ ] The push and the pop happen inside the primary column, with a back button in the stack's bar.

3. Tap the display mode button to hide the primary column, then show it again.

    - [ ] The column hides and shows with the nested stack inside, as a plain column does.
