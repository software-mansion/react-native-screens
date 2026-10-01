# Test Scenario: preferredVerticalBarBehavior

## Details

**Description:** Validates that `preferredVerticalBarBehavior` opts a
presented form sheet (with a native header) out of the vertical bar on
hardware that has one. With `disabled`, the sheet's bar items use the
standard horizontal header and, at full height, the status bar returns to
the horizontal axis.

**OS test creation version:** iOS 27.1

## E2E test

**TBD:** Requires the iPhone Duo outer display, which is not currently
automated.

## Prerequisites

- iPhone Duo simulator (iOS 27.1+), closed (outer display).
- A release build, or a debug build with the dev menu's floating button
  hidden: a window above the app keeps the status bar vertical while it is
  shown.

## Steps

1. Launch the app on the outer display and navigate to the **Preferred Vertical Bar Behavior** screen.

    - [ ] Both pickers default to `automatic` and `fitToContents`.

2. Tap **Open form sheet**.

    - [ ] The sheet's header items are laid out for the vertical bar (system default).

3. Close the sheet, set preferredVerticalBarBehavior = `disabled` and open it again.

    - [ ] The sheet's header is horizontal: title centered, no items moved to the side.
    - [ ] The status bar stays vertical (the sheet does not reach the top of the display).

4. Close the sheet, set sheet height = `large` and open it again.

    - [ ] The status bar is horizontal across the top of the display.
    - [ ] The sheet spans the full width and stops just short of the front camera.

5. Close the sheet, set preferredVerticalBarBehavior = `automatic` and open it again.

    - [ ] The status bar is vertical again and the sheet layout matches step 2.

6. Open the device (inner display) and repeat steps 2–4.

    - [ ] No change between `automatic` and `disabled` (no vertical bar on the inner display).
