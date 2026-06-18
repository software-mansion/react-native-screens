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
- The modal's content has a transparent background, so the provider's content (the "Inside count" button) stays visible behind it.
- Two counters exercise touch routing:
  - **"Outside count"** lives outside the provider (in the top section) and is never covered by the modal.
  - **"Inside count"** lives inside the provider, directly underneath where the modal is presented.

## Touch-routing invariant (applies in every step below)

Regardless of whether the provider is full-screen or partial:

- **"Outside count" must always be tappable** - before, while, and after a modal is presented. It sits outside the provider, so the modal must never block it.
- **"Inside count" must be blocked _only while the modal is open_.** While the modal is presented it sits underneath the (transparent) modal content and must not receive taps. As soon as the modal is dismissed it must be tappable again.

## Steps

### Baseline

1. Launch the app and navigate to the **Basic functionality** screen.

- [ ] Expected: Content is shown with the "Provider: full screen (tap for partial)" button, an "Open contained modal" button, an "Outside count: 0" button, and (inside the provider region) an "Inside count: 0" button.

---

### Background pressables work (no modal presented)

2. Tap "Outside count" and "Inside count" a few times each.

- [ ] Expected: Both counters increment on every tap (all of the provider's content and the surrounding content are interactive while no modal is presented).

---

### Present within a full-screen provider

3. Tap "Open contained modal".

- [ ] Expected: The modal appears with a cross-dissolve (fade-in) animation. The "🎉 This is a contained modal" text and the "Close" button are centered. Because the modal background is transparent, the underlying "Inside count" button is still visible behind it.

---

### Touch routing while the modal is open (full-screen provider)

4. With the modal still open, tap where the "Inside count" button is (underneath the modal), then tap "Outside count".

- [ ] Expected: "Inside count" does **not** increment (it is covered by the open modal). "Outside count" **does** increment (it is outside the provider and stays interactive). See the touch-routing invariant above.

---

### Dismiss

5. Tap "Close".

- [ ] Expected: The modal dismisses smoothly.

---

### Background pressable works again after dismiss (touch-handler cleanup)

> Regression check: after dismissal, the modal's touch handler must be detached.
> If it is not, it keeps consuming touches in the area the modal used to occupy and
> silently swallows taps meant for the "Inside count" button behind it, even though
> the modal is no longer visible.

6. Note the current "Inside count" value, then tap the "Inside count" button (the one
   that sits in the region the modal was just covering) several times. Tap "Outside
   count" too.

- [ ] Expected: Both counters increment on every tap. Taps on "Inside count" are NOT
      swallowed - there is no dead/unresponsive zone left behind where the dismissed
      modal used to be.

7. Re-open the modal ("Open contained modal"), tap "Close" again, and repeat the taps
   from step 6.

- [ ] Expected: Both counters still increment on every tap after this second
      open/close cycle (the touch handler is correctly re-attached on re-present and
      detached again on dismiss).

---

### Present within a partial provider

8. Tap "Provider: full screen (tap for partial)" to switch to the partial provider, then tap "Open contained modal".

- [ ] Expected: A bordered region (the provider bounds) is visible. The modal is presented **within that bordered region only**, not over the whole screen. The modal content is sized and positioned within the provider's bounds.

---

### Touch routing while the modal is open (partial provider)

9. With the modal still open, tap where the "Inside count" button is (underneath the modal, inside the bordered region), then tap "Outside count".

- [ ] Expected: Same invariant as the full-screen case - "Inside count" does **not** increment while the modal is open, "Outside count" **does**. The smaller provider size must not change this behavior.

---

### Dismiss from partial provider

10. Tap "Close".

- [ ] Expected: The modal dismisses smoothly and the screen returns to the partial-provider layout. "Inside count" is tappable again and "Outside count" keeps working.
