# Test Scenario: Large Title Letter Spacing (iOS, Stack V4)

## Details

Exercises `ScreenStackHeaderConfig.largeTitleLetterSpacing` on the native legacy
V4 stack. Spacing is in points and maps to the attributed-string kern. Omitted
and zero values leave UIKit's default spacing unchanged. This is a manual
scenario; no automated or native verification is claimed by adding it.

## Prerequisites

- Run FabricExample on iOS and open Single feature tests → Stack v4 →
  Large Title Letter Spacing (iOS).

## Steps

1. With custom typography and search disabled, observe the initial omitted
   spacing. Cycle to `0`.
   - [ ] The expanded title looks identical to the omitted value.
2. Cycle to `-0.9`, then `2`.
   - [ ] Negative fractional spacing tightens the title; positive spacing widens
     it even with no other large-title font or color props set.
3. Cycle from `2` back to omitted, then `0`.
   - [ ] Default spacing returns immediately; no previous kern remains.
4. Enable custom typography and repeat the complete spacing cycle.
   - [ ] The 30pt / 700 title responds to spacing and resets correctly.
5. For each spacing value, scroll the list until the title collapses, then return
   to the top.
   - [ ] Native collapse works, the compact title's spacing stays unchanged,
     and the expanded title retains the selected spacing.
6. At `-0.9` and `2`, push Details. Slowly swipe back, cancel once, then complete
   the gesture. Push again and use the native back button. Repeat after collapsing
   the root title (use the push button at the bottom of the list).
   - [ ] Both return paths preserve the root title's spacing and scroll state,
     with no unexpected spacing change during handoff or after cancellation.
7. Enable the search bar and repeat the spacing cycle, collapse and push/back
   steps. Focus search, type a query, cancel search, then disable the search bar.
   - [ ] Search remains usable and the large title retains the selected spacing
     when it reappears.
8. Disable custom typography and search. At the default system text size,
   compare omitted spacing with `-0.9`. Increase the system text size to a large
   setting, reopen the scenario if necessary, and compare omitted with `-0.9`
   again.
   - [ ] The title scales identically with omitted spacing and `-0.9`; only its
     tracking differs. Setting spacing alone must not replace the system font
     or prevent Dynamic Type scaling.
