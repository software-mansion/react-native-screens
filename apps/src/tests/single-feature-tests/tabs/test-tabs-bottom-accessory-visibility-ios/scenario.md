# Test Scenario: Bottom Accessory Visibility

## Details

**Description:** Validates the `bottomAccessoryHidden` prop on
TabsHost. The test verifies that the bottom accessory can be hidden
and shown with animation via the `hidden` toggle (which sets
`bottomAccessoryHidden`), independently from unmounting the React
tree via the `rendered` toggle (which sets `bottomAccessory` to
`undefined`). The key success criterion is that toggling `hidden`
produces a smooth animation with visible content, while toggling
`rendered` off may show blank content during the exit animation.

**OS test creation version:** iOS 26.0

## E2E test

Incomplete: covers the end state of all steps on iPhone - the accessory is
present with its content (and the tab bar laid out below it) or absent after
each `hidden` / `rendered` toggle.

Not automated: animation quality - smooth slide out/in with content visible
and no blank frame (all steps of **Hidden prop**, step 1 of
**Rendered prop** and step 3 of **Combined**).

## Prerequisites

- iOS 26 physical device or simulator

## Steps

### Baseline

1. Open the test scenario.

    - [ ] The bottom accessory is visible above the tab bar with
          "Bottom Accessory" text centered.

### Hidden prop

1. Toggle `hidden` on.

    - [ ] The bottom accessory animates out smoothly. The content
          remains visible during the animation.

2. Toggle `hidden` off.

    - [ ] The bottom accessory animates back in. The content is
          immediately visible — no blank frame.

### Rendered prop

1. Toggle `rendered` off.

    - [ ] The bottom accessory disappears.

2. Toggle `rendered` on.

    - [ ] The bottom accessory reappears with content.

### Combined

1. Toggle `hidden` on, then toggle `rendered` off.

    - [ ] No crash. The bottom accessory remains absent.

2. Toggle `rendered` on.

    - [ ] The bottom accessory does not appear (still hidden).

3. Toggle `hidden` off.

    - [ ] The bottom accessory animates in with content visible.
