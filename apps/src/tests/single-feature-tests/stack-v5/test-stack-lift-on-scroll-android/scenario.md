# Test Scenario: Header lift-on-scroll (Android)

## Details

**Description:** Exercises the Android Material 3 header **lift-on-scroll**
effect — the app bar's tonal/elevation shift applied when scrollable content
moves beneath the pinned `small` header.

`liftOnScroll` only applies to the `small` header, so this scenario fixes the
type to `small`.

For `medium`/`large` headers the collapsing app bar instead paints a
`CollapsingToolbarLayout` content scrim (driven by collapse, not by this prop),
so `liftOnScroll` has no effect there; that path is out of scope for this test.

**OS test creation version:** API 36

## E2E test

Incomplete - we can't detect the elevation/color flash with Detox.

## Prerequisites

- Android emulator or device.

## Note

- `liftOnScroll` defaults to `true`.
- `liftOnScroll` has no effect while the header is `transparent` (no scrolling
  content behavior is installed in that mode).

## Steps

### Baseline

1. Navigate to **Stack v5 → Lift on scroll (Android)**. Leave defaults
   (`liftOnScroll` = `undefined`).

- [ ] At rest the small header is flat (not lifted, lighter color).
- [ ] Scrolling the content up lifts the header once (tonal/elevation shift,
  darker color) and it stays lifted; scrolling back to the top returns it to
  flat.
- [ ] No flashing/flicker of the header elevation while scrolling.

2. Set `liftOnScroll` = `false`, then scroll.

- [ ] The header does not lift — it stays flat regardless of scroll position.

3. Set `liftOnScroll` = `true` (or `undefined`) again, then scroll.

- [ ] Lift is restored and re-applies without a visible header rebuild/flash.

### Transparent

4. Set `transparent` = `true`, then scroll.

- [ ] Lift is suppressed while transparent (no elevation shift).

5. Set `transparent` = `false`, then scroll.

- [ ] Lift behavior is restored.

### Hidden (detach / re-show the header)

6. Set `hidden` = `true`, scroll, then set `hidden` = `false`.

- [ ] While hidden there is no header. After re-showing, lift-on-scroll works
  again (the target scroll view is re-resolved).

### Attach / detach headerConfig

7. Toggle `headerConfig enabled` off, then on.

- [ ] Off removes the whole header. On re-attaches it and lift-on-scroll works
  again after re-attach.
