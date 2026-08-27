# Test Scenario: Stack Back Button (iOS)

## Details

**Description:** Tests back button configuration and layout with respect to changing
widths of elements in header. Back button props are configured on the screen
that renders the back button, but the native configuration is performed on the screen below.

**OS test creation version:** 26.4

## E2E test

TBD.

## Prerequisites

- iOS simulator

## Note

There are differences in behavior between iOS <= 18 and 26+. By default, only
chevron is displayed for the latter, whereas the former shows the title
of the screen below if it fits, or generic "Back".

On iOS <= 18, when header contents change so that the back title no longer fits,
it is compacted to either "< Back" or "<" (this depends on what displayMode is specified).
When the header changes content again, the button title doesn't adjust and is left in
compact state. This is confirmed native behavior.

## Steps

### iOS 18

1. Launch the test screen.
2. On the Home screen, click First.
  - A new screen is pushed with back button configuration options
  - "First" title is displayed in the header
  - Back button displays as "< Home"
3. Under Current screen, tap `backTitle` once to set "Custom title"
  - Back button displays as "< Custom title"
4. Tap `displayMode` once to set "generic"
  - Back button displays as "< Back"
5. Tap `displayMode` again to set "minimal"
  - Back button displays as "<"
6. Tap `displayMode` again to go back to default. Tap `title` to set "Custom title". Tap `trailingItemsCount` 3 times to show 3 items.
  - Back button displays as "< Back"
7. Tap `trailingItemsCount` again to collapse items. Tap `backTitle` 3 times to reset "Custom title". Tap `title` to set "Longer custom title".
  - Back button displays as "< Back"
8. Tap `trailingItemsCount` 3 times to show 3 items.
  - This time back button displays only as "<"
9. Tap `title` and `trailingItemsCount` once to reset. Tap `Push Second`.
  - A new screen is pushed
  - Screen title is "Second" and back button displays as "< First"
10. Under Next screen, tap `Pop` to pop the screen. Tap `title` to set "Custom title". Tap `backTitle` twice to set "Longer custom title". Tap `Push Second`.
  - A new screen is pushed
  - Screen title is "Custom title" and back button displays as "< Back"
11. Tap the back button to pop. Tap `Push Bare (no header config)`.
  - A new screen without a header config is pushed
  - Back button displays as "< First" (system default), NOT the back title
    configured for the previously pushed Second screen

### iOS 26

1. Launch the test screen.
2. On the Home screen, click First.
  - A new screen is pushed with back button configuration options
  - "First" title is displayed in the header
  - Back button displays as "<"
3. Under Current screen, tap `backTitle` once to set "Custom title"
  - Back button displays as "< Custom title"
4. Tap `displayMode` once to set "generic"
  - Back button displays as "<"
5. Tap `displayMode` again to set "minimal"
  - Back button displays again as "<"
6. Tap `displayMode` again to go back to default. Tap `title` to set "Custom title". Tap `trailingItemsCount` 3 times to show 3 items.
  - Back button displays as "<"
7. Tap `trailingItemsCount` again to collapse items. Tap `title` and `backTitle` to set "Longer custom title" for both.
  - Back button displays as "<"
8. Tap `title` and `backTitle` once to reset. Tap `Push Second`.
  - A new screen is pushed
  - Screen title is "Second" and back button displays as "<"
9. Under Next screen, tap `Pop` to pop the screen. Tap `backTitle` twice to set "Custom title". Tap `Push Second`.
  - A new screen is pushed
  - Back button displays as "< Custom title"
10. Tap the back button to pop. Tap `Push Bare (no header config)`.
  - A new screen without a header config is pushed
  - Back button displays as "<" (system default), NOT "< Custom title"
    configured for the previously pushed Second screen
