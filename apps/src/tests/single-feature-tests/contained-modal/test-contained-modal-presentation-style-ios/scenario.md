# Test Scenario: Presentation style

## Details

**Description:** Verify the `transparent` prop of the `ContainedModal` component. The
prop selects the presentation context used to present the modal within its provider:

- `transparent: true` → `UIModalPresentationOverCurrentContext`: the presenting
  content (the provider's content) stays visible underneath the modal, so a modal with
  a transparent background lets it show through.
- `transparent: false` → `UIModalPresentationCurrentContext`: the presenting content is
  replaced by the modal, so the provider's content is no longer visible behind it (even
  if the modal's own background is transparent).

**OS test creation version:** iOS: 18.6 and 26.4, iPadOS 26.4

## E2E test

TBD.

## Prerequisites

- iOS device or simulator: iPhone and iPad
- `ContainedModal` is currently an iOS-only component.

## Note

- The modal's content has a transparent background. This is what makes the difference
  between the two presentation contexts observable: with `transparent: true` the
  provider's content shows through; with `transparent: false` it does not.
- The toggle button switches the `transparent` prop. Because `modalPresentationStyle`
  can only be set before a modal is presented, the toggle takes effect on the **next**
  open - changing it while the modal is already presented does not retroactively change
  the current presentation.

## Steps

### Baseline

1. Launch the app and navigate to the **Presentation style** screen.

- [ ] Expected: Content is shown with a "transparent: true (OverCurrentContext)" toggle
      button, an "Open contained modal" button, and (inside the bordered provider region)
      the provider background text.

---

### Present with `transparent: true` (OverCurrentContext)

2. Make sure the toggle reads "transparent: true (OverCurrentContext)", then tap
   "Open contained modal".

- [ ] Expected: The modal appears with a cross-dissolve (fade-in) animation. The
      "🎉 This is a contained modal" text and the "transparent = true" subtitle are
      centered. Because the modal background is transparent **and** it is presented over
      the current context, the provider background text is still visible behind the
      modal.

3. Tap "Close".

- [ ] Expected: The modal dismisses smoothly and the provider content is shown again.

---

### Present with `transparent: false` (CurrentContext)

4. Tap the toggle so it reads "transparent: false (CurrentContext)", then tap
   "Open contained modal".

- [ ] Expected: The modal appears with a cross-dissolve animation. The "🎉 This is a
      contained modal" text and the "transparent = false" subtitle are centered. This
      time the provider background text is **not** visible behind the modal - the
      presenting content has been replaced by the modal (current-context presentation),
      so even though the modal background is transparent, the provider content does not
      show through.

5. Tap "Close".

- [ ] Expected: The modal dismisses smoothly and the provider content is shown again.

---

### Toggle takes effect only on the next open

6. With the modal closed, open it again and, while it is presented, the toggle cannot be
   reached (it is behind the modal). Close the modal, flip the toggle, and open again.

- [ ] Expected: Each newly presented modal uses the value of `transparent` as it was at
      the moment of presentation. Switching the toggle between presentations reliably
      switches between the over-current-context and current-context behavior described
      above.
