# Test Scenario: Stack Layout Direction (Android)

## Details

**Description:** Validates the `direction` prop on `StackHost`, which controls
the layout direction of the stack's native container and everything it holds:
the Material 3 app bar (title, subtitle, leading/center/trailing subviews,
back button, toolbar menu) and the screen content. Success means every
direction-relative element resolves against the effective direction, that
switching direction at runtime re-lays the header out immediately and
correctly in both directions, and that push/pop transitions mirror.

The prop is currently Android-only. On Android it works through React Native's
`style.direction`, which sets the native `layoutDirection` on the host view;
the stack's native subtree inherits it. `inherit` therefore falls back to
whatever a parent view resolves to, which in practice means React Native's own
`I18nManager` setting.

**OS test creation version:** Android API 37.

## E2E test

TBD

Automation is possible for most of the scenario - the probe subviews and the
title have stable bounds that Detox can read - but it is not implemented yet.
The back-arrow mirroring and the transition direction would still need a
visual check.

## Prerequisites

- Android emulator or physical device.
- `supportsRtl` enabled in the app manifest.

## Note

- The steps run as one continuous sequence: every step assumes the state left
  by the previous one, and the scenario ends back at the starting state.
- The `direction` picker is the subject of this test. The `forceRTL` switch
  only matters for the `inherit` case, and only after an app restart.
- **Probe reference:** `L·48` is the leading subview, `T·48` the trailing one,
  `C·48` the center one. In LTR order, `L` is leftmost and `T` rightmost; in
  RTL the two swap. `C` stays centered in both. The `centerSubview` switch is
  shown only for the `small` header, which is the only type that supports it.
- The default back arrow comes from the theme (`homeAsUpIndicator`) and is
  auto-mirrored, so it points left in LTR and right in RTL. A custom
  `backButtonIcon` supplied as a bitmap is **not** mirrored - that is expected,
  and out of scope here.
- `contentInsetStart` / `contentInsetEnd` under RTL are covered by
  `test-stack-header-content-insets-android`.
- `medium` is deliberately not in the header-type picker: it shares the whole
  collapsing code path with `large` and differs only in type scale.

---

## Steps

### Baseline

1. Navigate to the **Stack Layout Direction** scenario. It opens with
   `direction = inherit`, `type = small`, `menu = none`, leading and trailing
   subviews on and the center subview off.

- [ ] React Native RTL label is `I18nManager.isRTL == false`.
- [ ] Title `Direction` and subtitle `Subtitle` are left-aligned.
- [ ] `L·48` sits just after the title, `T·48` on the right edge.
- [ ] The content row reads `START` on the left, `END` on the right.

---

### A. Small header

2. Set `direction = rtl`.

- [ ] Title and subtitle move to the right and are right-aligned.
- [ ] `L·48` moves to the right edge, `T·48` to the left edge.
- [ ] The content row now reads `END` on the left, `START` on the right, and
      every control label in the screen body is right-aligned.

3. Turn `titleCentered` and `subtitleCentered` on.

- [ ] Title and subtitle are horizontally centered, unchanged by direction.
      Leading subview doesn't move to the leading edge - this is a known issue.

4. Turn `titleCentered` and `subtitleCentered` back off.

- [ ] Title and subtitle are right-aligned again, as in step 2.

5. Turn `centerSubview` on.

- [ ] `C·48` is centered in the bar, between `T·48` on the left and `L·48` on
      the right.

6. Set `direction = ltr`.

- [ ] `L·48` is on the left edge, `T·48` on the right, and `C·48` is still
      centered. The title is left-aligned.

7. Set `direction = rtl`, then turn `centerSubview` back off.

- [ ] The arrangement from step 2 is restored: `L·48` right, `T·48` left, no
      `C·48`.

8. Set `menu = action + overflow`.

- [ ] The overflow button (⋮) and the `ACT` action item appear on the left
      edge, in the order `⋮`, `ACT`, `T·48` from the left. `L·48` stays on the
      right edge.

9. Set `direction = ltr`.

- [ ] Everything mirrors: `L·48` on the left edge, then `T·48`, `ACT` and `⋮`
      toward the right edge.

10. Set `menu = none`.

- [ ] The header matches the baseline in step 1 exactly.

---

### B. Collapsing header

This section is the reason the collapsing-toolbar RTL workaround exists.
`CollapsingToolbarLayout` injects a full-width dummy view into the toolbar and
the toolbar walks its custom children in opposite order per direction, so the
two have to stay in sync. A subview going missing or collapsing onto the wrong
edge after a direction switch is the failure to watch for.

11. Set `type = large`.

- [ ] `L·48` sits on the left edge and `T·48` on the right, both at their full
      48dp width. Neither is missing, clipped or squeezed against the other.
- [ ] The expanded title is large and left-aligned.

12. Set `direction = rtl`.

- [ ] `L·48` moves to the right edge and `T·48` to the left, both still at
      full width and still separated by the whole bar.
- [ ] The expanded title is right-aligned.

13. Set `direction = ltr`.

- [ ] The arrangement from step 11 is restored exactly. In particular `L·48`
      is present - it must not disappear.

14. Repeat steps 12 and 13 two more times.

- [ ] Every switch lands on the correct arrangement, in both directions.

15. Set `menu = action + overflow`.

- [ ] `L·48` is still on the left edge at full width; `T·48`, `ACT` and `⋮`
      are on the right.

16. Repeat steps 12 and 13 two more times, now with the menu on.

- [ ] Every switch is still correct: both probes keep their full width, and
      the menu group sits on the trailing edge - left in RTL, right in LTR.

17. Set `direction = rtl`, then set `expandedTitleHorizontalGravity` to
    `center`, then to `end`, then back to `start`.

- [ ] `start` puts the expanded title on the right, `center` in the middle and
      `end` on the left.

18. Scroll the content down until the header is fully collapsed.

- [ ] The collapsed toolbar keeps `L·48` on the right and `T·48`, `ACT` and
      `⋮` on the left.

19. Set `collapsedTitleHorizontalGravity` to `center`, then to `end`, then
    back to `start`.

- [ ] The collapsed title follows the same mapping: `start` right, `center`
      middle, `end` left.

20. Scroll back up until the header is fully expanded.

- [ ] The expanded layout is the same as after step 17.

---

### C. Navigation

21. Press **Push screen (adds a back button)**.

- [ ] The incoming screen slides in from the **left**.
- [ ] On the pushed screen the back arrow sits on the **right** (leading) edge
      and points **right**.
- [ ] The pushed screen's header is laid out RTL from the first frame - it
      never appears left-to-right and then flips.

22. Tap the back arrow.

- [ ] The stack pops, mirroring the push: the popped screen leaves to the left.

23. Press **Push screen** again, then use the system back gesture or button.

- [ ] The stack pops the same way as in step 22.

24. Press **Push screen** again, then set `direction = ltr` from the pushed
    screen.

- [ ] The pushed screen's header and content flip immediately: `L·48` moves to
      the left edge, `T·48` to the right, and the back arrow moves to the left
      edge and points left.

25. Tap the back arrow.

- [ ] The pop mirrors the LTR direction: the popped screen leaves to the right.

26. Press **Push screen** again, then tap the back arrow.

- [ ] The push slides in from the right and out to the left, i.e. the
      behaviour in LTR is unchanged.

---

### D. Runtime switching

27. Set `type = small`, then cycle `direction` through
    `inherit` → `ltr` → `rtl` → `ltr` → `inherit` rapidly.

- [ ] The header and the screen content update immediately on every change,
      with no intermediate or stuck state.
- [ ] `inherit` resolves to LTR, matching `I18nManager.isRTL == false`.

28. Set `type = large`, then repeat the same cycle.

- [ ] Same result. Notably the probe subviews are correct after every single
      step, not only after the last one.

29. Press **Push screen**, repeat the cycle from the pushed screen, then tap
    the back arrow.

- [ ] Both the pushed screen and, after popping, the root screen are laid out
      in the direction selected last.

---

### E. `inherit`

30. Set `menu = none` and `type = small`, then read the `I18nManager.isRTL`
    label with `direction = inherit`.

- [ ] The label reads `I18nManager.isRTL == false` and the stack is laid out
      LTR.

31. Turn `forceRTL` on, restart the app, reopen the scenario.

- [ ] The label reads `I18nManager.isRTL == true` and the stack is laid out
      RTL: React Native's direction propagates through the view hierarchy to
      the native container.

32. Set `direction = ltr`.

- [ ] The explicit prop wins and the stack is laid out LTR.

33. Turn `forceRTL` back off and restart the app.

- [ ] Reopening the scenario shows the baseline state from step 1.
