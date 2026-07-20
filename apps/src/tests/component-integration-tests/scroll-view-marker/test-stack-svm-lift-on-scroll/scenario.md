# Test Scenario: Integration: SVM + Stack small header lift-on-scroll

## Details

**Description:**
This test verifies the interaction between `ScrollViewMarker` and a Stack v5
Material 3 header in the scope of lift-on-scroll. A `small` header is configured
with `scrollFlagScroll`, `scrollFlagEnterAlways` and `liftOnScroll` enabled, and
its content `ScrollView` is wrapped in a `ScrollViewMarker`. The goal is to
confirm that the header's lifted (tonal/elevation) state stays stable while
scrolling — it must not flash.

**OS test creation version:**
Android API 36

## E2E test

Incomplete - we can't detect color flash with Detox.

## Prerequisites

- Android emulator or device.

## Steps

1. Launch the app and navigate to **ScrollViewMarker Integration Tests → SVM
   lift-on-scroll (small header, no flash)**.

- [ ] A small header titled `Lift on scroll` is shown above a scrollable list.
- [ ] At rest (content at top), the header sits flat — not lifted (lighter
      color).

2. Slowly scroll the list up (content moves under the header).

- [ ] The header lifts once (single tonal/elevation change) and then stays
  lifted (darker color).
- [ ] The header does NOT flash — its elevation does not flicker on/off during
  the scroll.

3. Fling / scroll quickly up and down repeatedly.

- [ ] The lifted state tracks scroll position smoothly with no flashing.
- [ ] The header keeps darker color (unless scrolled to the very top).

4. Scroll all the way back to the top.

- [ ] The header returns to its flat (non-lifted) state (lighter color).
