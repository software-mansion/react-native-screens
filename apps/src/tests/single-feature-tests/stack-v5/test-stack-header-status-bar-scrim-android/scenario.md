# Test Scenario: Header status bar scrim (Android)

## Details

**Description:** Exercises the Android Material 3 header status bar scrim
(`statusBarScrimColor`) — the strip masking header content that passes under
the status bar in edge-to-edge apps. For the `small` header the scrim is a
constant strip pinned to the top of the window that by default follows the
bar's effective background color through the lift-on-scroll transition. For
`medium`/`large` headers it fades in and out together with the content scrim
and by default matches its color. Verifies the auto-following defaults, the
opt-out for translucent backgrounds, explicit and `'transparent'` values, and
the masking of toolbar content scrolling under the status bar.

**OS test creation version:** API 37

## E2E test

Incomplete: not automated. Every assertion in this scenario is about rendered
colors and animated transitions, neither of which Detox can read.

## Prerequisites

- Android emulator or device

## Note

- The `small` strip is constant (always covers the status-bar area) while the
  `medium`/`large` scrim shows only while the header is collapsed — this
  asymmetry mirrors the native Material widgets and is expected.
- The `scrollFlagExitUntilCollapsed` switch only takes effect for
  `medium`/`large` headers. When OFF, the collapsing header exits fully and
  its pinned toolbar passes under the status bar — the main masking case.
- The whole stack is wrapped in a purple backdrop; it is visible through the
  header when it is transparent.

## Steps

### Small header

1. Navigate to **Stack v5 → Header status bar scrim (Android)**. Leave
   defaults and observe the header at rest.

- [ ] The status-bar area matches the header background exactly — no visible
      seam or band.

2. Scroll up so the toolbar scrolls off the screen.

- [ ] The title and buttons passing under the status bar are masked by a
      solid strip; the status bar icons sit on that strip, not on the list
      content.
- [ ] The strip color matches the scrolled (lifted) header color.

3. Set `backgroundColor` = `red` and `scrolledBackgroundColor` = `blue`, then
   scroll slowly up and down.

- [ ] The strip animates between light red (at rest) and blue (scrolled) in
      sync with the header's own color transition — it is never frozen at a
      stale color.

4. While scrolled (strip in the scrolled color), set `backgroundColor` =
   `green`.

- [ ] The strip immediately shows the scrolled color without animating from
      the resting color; scrolling to the top reveals the light green strip.

5. Set `statusBarScrimColor` = `red`.

- [ ] A constant strong-red strip covers the status-bar area at rest and
      while scrolled, regardless of the background colors.

6. Set `statusBarScrimColor` = `transparent`, then scroll the toolbar off.

- [ ] No strip: toolbar content is visible through the status-bar area.

7. Set `statusBarScrimColor` back to `default` and `backgroundColor` =
   `translucent`.

- [ ] No default strip appears: the translucent header shows a uniform tint
      with no darker double-composited band in the status-bar area.

8. Keep `backgroundColor` = `translucent` and set `statusBarScrimColor` =
   `blue`.

- [ ] The explicit blue strip is applied over the translucent background.

### Medium / large header

9. Set `type` = `medium` (later repeat with `large`), all colors `default`,
   `scrollFlagExitUntilCollapsed` ON. Collapse the header.

- [ ] The scrim fades in with the collapse; with the default color it is
      seamless — the status-bar area matches the collapsed toolbar color.

10. Turn `scrollFlagExitUntilCollapsed` OFF and scroll the header fully away.

- [ ] While the toolbar and title pass under the status bar they are masked
      by the scrim; the mask fades out again when the header re-expands.

11. Set `scrolledBackgroundColor` = `green` and collapse.

- [ ] The status-bar area matches the strong green content scrim while
      collapsed; both fade out together when expanding.

12. Set `statusBarScrimColor` = `red` and collapse.

- [ ] A red scrim fades in over the status-bar area together with the green
      content scrim below it; no red is visible while expanded.
- [ ] Mid-fade the status-bar area is not darker than the fading scrims — the
      status bar scrim never stacks on top of the content scrim.

13. Set `statusBarScrimColor` = `transparent`, `scrollFlagExitUntilCollapsed`
    OFF, and scroll the header away.

- [ ] Toolbar content is visible through the status-bar area (no mask).

14. Set `statusBarScrimColor` back to `default` and `scrolledBackgroundColor`
    = `translucent`, then collapse.

- [ ] No default status-bar scrim: the translucent content scrim shows
      without an extra darker band in the status-bar area.

### Type changes keep settings

15. Set `backgroundColor` = `red`, `scrolledBackgroundColor` = `blue`,
    `statusBarScrimColor` = `green`, then switch `type` across `small` →
    `medium` → `large` → `small`.

- [ ] After every switch the scrim behavior matches the current type with the
      same colors: constant green strip on `small`, green scrim fading with
      collapse on `medium`/`large`.
