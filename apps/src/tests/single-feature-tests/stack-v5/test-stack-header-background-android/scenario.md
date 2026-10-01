# Test Scenario: Header background (Android)

## Details

**Description:** Exercises the Android Material 3 header background
customization: `backgroundColor` (the app bar background) and
`scrolledBackgroundColor` (the color shown when content is scrolled beneath
the header — the lift-on-scroll target color for the `small` header, the
`CollapsingToolbarLayout` content scrim for `medium`/`large`). Verifies that
custom colors keep the lift/scrim transitions working, that clearing a prop
restores the Material default, and that the colors compose with edge-to-edge
and the `backgroundSubview`.

**OS test creation version:** API 37

## E2E test

Incomplete: not automated. Every assertion in this scenario is about rendered
colors and animated transitions, neither of which Detox can read.

## Prerequisites

- Android emulator or device.

## Note

- The `backgroundSubview` switch only takes effect for `medium`/`large`
  headers. The trees image fills only the trailing part of the header, so the
  background color stays visible next to it.
- The whole stack is wrapped in a purple backdrop; it is visible through the
  header when it is transparent.

## Steps

### Small header

1. Navigate to **Stack v5 → Header background (Android)**. Leave defaults.

- [ ] At rest the header uses the default surface color; scrolling up animates
      it to the slightly darker default lifted color, scrolling back to top
      returns it.

2. Set `backgroundColor` = `red`.

- [ ] The header (including the status bar area behind it) turns light red at
      rest.
- [ ] Scrolling up animates light red to the default lifted color and back.

3. Set `scrolledBackgroundColor` = `red`, then scroll.

- [ ] The header darkens from light red to the stronger red when content
      scrolls beneath it, and returns at the top. No flicker while scrolling.

4. While scrolled (header in the stronger red), set `backgroundColor` =
   `green`.

- [ ] The header immediately keeps the scrolled (red) color without animating
      from the resting color; scrolling to top reveals light green.

5. Set `scrolledBackgroundColor` = `translucent`, then scroll.

- [ ] The scrolled color blends over the background color (navy-tinted light
      green) instead of replacing it.

6. While scrolled, set `scrolledBackgroundColor` = `transparent`.

- [ ] The header keeps the background color regardless of scroll position.

7. Set both `backgroundColor` and `scrolledBackgroundColor` = `transparent`.

- [ ] The header area (including the status bar area) shows the purple screen
      backdrop through the fully transparent header; the title and buttons
      remain visible.

8. Set both pickers back to `default`.

- [ ] The header returns to the Material default colors without a visible
      rebuild.

9. Set both `backgroundColor` and `scrolledBackgroundColor` = `platform`,
   then scroll.

- [ ] At rest the header uses the OS-resolved light green
      (`holo_green_light`); scrolling darkens it to the OS-resolved dark green
      (`holo_green_dark`) and back.

### Medium / large header

10. Set `type` = `medium` (later repeat with `large`), colors = `default`.

- [ ] Expanded header shows the default surface color; collapsing it fades in
      the default content scrim color over the toolbar area.

11. Set `backgroundColor` = `green` and `scrolledBackgroundColor` = `green`.

- [ ] Expanded header is light green, including the status bar area.
- [ ] Collapsing fades in the stronger green scrim; expanding fades it out
      back to light green.

12. Enable `backgroundSubview`.

- [ ] The trees image fills the trailing part of the expanded header (also
      behind the status bar) with the light green background visible next to
      it, and moves with parallax while collapsing.
- [ ] The green scrim fades in above the image when collapsed; the title and
      buttons stay above the scrim.

13. Set `scrolledBackgroundColor` = `translucent` and collapse.

- [ ] The scrim tints the image instead of fully covering it.

14. Set `scrolledBackgroundColor` = `transparent` and collapse.

- [ ] No scrim appears — the image and background color stay fully visible
      when collapsed.

15. Set both colors back to `default` with the subview still enabled.

- [ ] Collapsed state shows the default scrim color again.

### Type changes keep colors

16. Set `backgroundColor` = `red`, `scrolledBackgroundColor` = `blue`, then
    switch `type` across `small` → `medium` → `large` → `small`.

- [ ] After every switch the header keeps light red at rest and blue when
      scrolled/collapsed.
