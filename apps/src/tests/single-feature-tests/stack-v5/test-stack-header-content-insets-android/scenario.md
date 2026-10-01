# Test Scenario: contentInsetStart / contentInsetEnd (Android)

## Details

**Description:** Verifies `contentInsetStart` and `contentInsetEnd` on the
Stack v5 Android header config. Both map to
`Toolbar.setContentInsetsRelative`, which bounds the toolbar's _content area_
— the region the title, the collapsed title and the leading/center/trailing
subviews are laid out in.

The props exist because `collapsedTitleGravityMode: 'entireSpace'` is
unusable, so `'availableSpace'` is the practical choice — and under
`availableSpace` Material computes the collapsed title's gravity over the
content area, which the platform's default start inset shrinks. A `center`
collapsed title then reads as off-center even with no subviews present.
Zeroing the insets is the escape hatch.

The scenario covers two things: that the dp value is applied on both sides,
across header types, and that leaving a prop unset restores Material's
default; and that the centered collapsed title lines up once the insets are
zeroed.

**OS test creation version:** API 37

## E2E test

TBD

Automation is possible for most of the scenario but is not implemented yet.

## Prerequisites

Android emulator or physical device.

## Note

- Material's defaults are **not symmetric**: the start inset is 16dp, the end
  inset is 0.
- **Layout order differs by header type.** The toolbar lays out its title
  block before its start-gravity custom children, so on `small` the order is
  `[start inset][title][L probe]` — the leading probe is _not_ a direct
  measure of the start inset there, it only moves with the title. On
  `medium` / `large` the toolbar has no title view (the collapsing layout
  draws the collapsed title itself), so the order is
  `[start inset][L probe][collapsed title]` and the probe does measure the
  inset. The end side is `[T probe][menu][end inset]` on every type.
- The inset is a **minimum**, not an offset. The navigation icon and the
  toolbar menu are laid out first and are not bounded by it, so
  `contentInsetStart` is inert while a back button is visible until it
  exceeds the nav icon's width (`64` / `96` in the picker are above it,
  `0`–`32` are below). `contentInsetEnd` behaves the same way against menu
  items.
- On `medium` / `large` the props affect the **collapsed** title only.
- Toggling `forceRTL` requires an app restart or reload before it takes
  effect.

## Steps

### Baseline

1. Navigate to Single feature tests → Stack v5 →
   `test-stack-header-content-insets-android`.

- [ ] A `small` header titled "Insets" is visible. The title sits at the
      start of the content area, the `L·40` probe immediately after it, and the
      `T·40` probe at the trailing edge.
- [ ] The title's leading edge is inset by roughly 16dp — visibly less than
      half the `L·40` probe's width. The trailing probe sits flush against the
      trailing edge, because Material's end default is 0.

### Start inset — small

The title is the measure here; the probe follows it.

2. Set `contentInsetStart` to `0`.

- [ ] The title moves to the very leading edge of the toolbar, and the
      `L·40` probe moves with it by the same amount.
- [ ] The trailing probe does not move.

3. Step `contentInsetStart` through `16`, `32`, `64`, `96`.

- [ ] The title's leading edge moves further from the leading edge at each
      step, by the amount the value grew, and the probe keeps the same distance
      behind it.
- [ ] At `96` the title starts roughly two and a half `L·40` widths in.

4. Set `contentInsetStart` back to `default`.

- [ ] The title and the probe return to exactly the positions they had in
      step 1.

5. Set `contentInsetStart` to `16`.

- [ ] Nothing moves — Material's start default is the same 16dp.

6. Set `leadingSubview` to `none`, then step `contentInsetStart` between `0`
   and `96` again.

- [ ] The title behaves exactly as it did with the probe present; the probe
      was never affecting the measurement.

### End inset

7. Tap `Reset`, then step `contentInsetEnd` through `32`, `64`, `96`.

- [ ] The `T·40` probe moves away from the trailing edge at each step, by the
      amount the value grew.
- [ ] Neither the title nor the leading probe moves.

8. Set `contentInsetEnd` to `0`, then to `default`.

- [ ] The trailing probe returns flush against the trailing edge for both
      values, and does not shift between them — Material's end default is 0.

### Back button — start-side inertness

9. Reset, then tap "Push screen (adds a back button)".

- [ ] The pushed header shows a back button, and the title now starts after
      it — further in than it did on `Root`. The `L·40` probe follows.

10. On the pushed screen, set `contentInsetStart` to `0`, then `16`, then
    `32`.

- [ ] Nothing moves — all three values are below the nav icon's width, so the
      inset is inert.

11. Set `contentInsetStart` to `96`.

- [ ] The title finally moves further in, past the back button, and the probe
      follows.

12. Turn `backButtonHidden` on and set `contentInsetStart` to `0`.

- [ ] The back button disappears and the title jumps to the toolbar's leading
      edge.

### Toolbar menu — end-side inertness

13. Turn `backButtonHidden` off, go back to `Root`, tap `Reset`, set
    `menuItems` to `1`.

- [ ] One action item `M0` appears at the trailing edge, and the `T·40` probe
      sits before it.

14. Step `contentInsetEnd` through `0`, `16`, `32`.

- [ ] `M0` stays pinned where it is — it is laid out before the inset
      applies.
- [ ] The trailing probe does not move either, for the same reason the back
      button pins the start side: the menu already reaches further in than these
      values.

15. Set `contentInsetEnd` to `96`.

- [ ] `M0` still does not move.
- [ ] The trailing probe is pushed further in, past the menu item — the inset
      now exceeds the menu's width and takes effect again.

### Collapsing headers — the motivating case

16. Tap the `Off-center collapsed title` preset, then scroll the content up
    until the `large` header is fully collapsed.

- [ ] The collapsed title is horizontally **off-center** — shifted towards
      the trailing edge, because it is centered inside a content area that the
      default start inset shrank.
- [ ] The expanded title (scroll back down) is unaffected.

17. Tap the `Fixed with insets` preset and collapse the header again.

- [ ] The collapsed title is centered in the header.

### Collapsing headers — start inset without a title view

18. Set `type` to `medium`, `collapsedTitleHorizontalGravity` to `start`,
    `leadingSubview` to `none`, `contentInsetStart` to `96`. Collapse the
    header.

- [ ] The collapsed title starts 96dp from the leading edge.

19. Set `leadingSubview` to `ruler`.

- [ ] The `L·40` probe takes the 96dp position — here it _is_ the start-inset
      measure, because the toolbar has no title view of its own.
- [ ] The collapsed title is pushed a further 40dp in, to the probe's
      trailing side. This is the opposite order from the `small` header.

### RTL

20. Reset. Turn `forceRTL` on and reload the app, then navigate back to this
    scenario.

- [ ] `I18nManager.isRTL == true` is displayed.
- [ ] The header lays out right-to-left: the title and the `L·40` probe are
      on the right, `T·40` on the left.

21. Set `contentInsetStart` to `96`.

- [ ] The title moves further from the **right** edge — the props are
      relative, so start follows the layout direction.
- [ ] The trailing probe on the left does not move.

22. Turn `forceRTL` off and reload.

- [ ] Layout returns to left-to-right and the insets follow it back.
