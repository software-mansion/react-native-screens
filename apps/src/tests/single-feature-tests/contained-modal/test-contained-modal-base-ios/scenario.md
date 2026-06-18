# Test Scenario: Basic functionality

## Details

**Description:** Verify the core functionality of the `ContainedModal` component together with `ContainedModalProvider`. This test ensures that the modal is presented within the bounds of the provider it targets (matched by `containerId` / `targetContainerId`), that it works both with a full-screen and a partial-size provider, that its transparent background lets the provider's content show through (over-current-context presentation), and that presenting/dismissing repeatedly keeps working.

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4

## E2E test

TBD.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- `ContainedModal` is currently an iOS-only component.

## Note

- The modal is presented from the provider whose `containerId` equals the modal's `targetContainerId`, so it is contained within that provider's bounds, not presented over the whole window.
- The modal's content has a transparent background, so the provider's content (including the "Count (behind modal)" button) stays visible behind it.

## Steps

### Baseline

1. Launch the app and navigate to the **Basic functionality** screen.

- [ ] Expected: Content is shown with the "Provider: full screen (tap for partial)" button, an "Open contained modal" button, and a "Count (behind modal): 0" button.

---

### Background pressable works

2. Tap the "Count (behind modal)" button a few times.

- [ ] Expected: The counter increments each tap (the provider's content is interactive while no modal is presented).

---

### Present within a full-screen provider

3. Tap "Open contained modal".

- [ ] Expected: The modal appears with a cross-dissolve (fade-in) animation. The "🎉 This is a contained modal" text and the "Close" button are centered. Because the modal background is transparent, the underlying "Count (behind modal)" button is still visible behind it.

---

### Dismiss

4. Tap "Close".

- [ ] Expected: The modal dismisses smoothly. The background and its counter button are interactive again.

---

### Background pressable works again after dismiss (touch-handler cleanup)

> Regression check: after dismissal, the modal's touch handler must be detached.
> If it is not, it keeps consuming touches in the area the modal used to occupy and
> silently swallows taps meant for the content behind it, even though the modal is
> no longer visible.

5. Note the current "Inside count" / "Outside count" value, then tap the counter
   button (the one that sits in the region the modal was just covering) several
   times.

- [ ] Expected: The counter increments on every tap. Taps are NOT swallowed - there
      is no dead/unresponsive zone left behind where the dismissed modal used to be.

6. Re-open the modal ("Open contained modal"), tap "Close" again, and repeat the
   taps from step 5.

- [ ] Expected: The counter still increments on every tap after this second
      open/close cycle (the touch handler is correctly re-attached on re-present and
      detached again on dismiss).

---

### Present within a partial provider

5. Tap "Provider: full screen (tap for partial)" to switch to the partial provider, then tap "Open contained modal".

- [ ] Expected: A bordered region (the provider bounds) is visible. The modal is presented **within that bordered region only**, not over the whole screen. The modal content is sized and positioned within the provider's bounds.

---

### Dismiss from partial provider

6. Tap "Close".

- [ ] Expected: The modal dismisses smoothly and the screen returns to the partial-provider layout. Pressables remain working.
