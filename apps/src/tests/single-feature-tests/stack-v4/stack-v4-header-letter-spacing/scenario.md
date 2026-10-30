# Test Scenario: Header Letter Spacing (Stack V4)

## Details

Exercises `titleLetterSpacing`, `largeTitleLetterSpacing` (iOS),
`backTitleLetterSpacing` (iOS) and bar button item `titleStyle.letterSpacing`
(iOS) on the native legacy V4 stack. Spacing is in points. On iOS it maps to
the attributed-string kern, which replaces the font's default kerning, so an
explicit `0` (kerning disabled) differs from an omitted value. On Android only
the title is customizable, and the value is converted to ems like `Text`'s
`letterSpacing`. This is a manual scenario.

## Prerequisites

- Run FabricExample and open Single feature tests → Stack v4 → Header Letter
  Spacing.

## Steps

1. With custom typography and search disabled, observe the initial omitted
   spacing, then cycle to `0`.
   - [ ] iOS: the large title gets slightly wider at `0`, because kerning is
         disabled.
   - [ ] Android: `0` matches the omitted spacing of the default toolbar theme.
2. Cycle to `-0.9`, then `2`.
   - [ ] Negative fractional spacing tightens the title (and, on iOS, the large
         title and the "Edit" bar button); positive spacing widens them, with no
         other font props set.
3. Cycle from `2` back to omitted.
   - [ ] The default spacing returns immediately; no previous spacing remains.
4. Turn off each "Apply to" switch in turn.
   - [ ] Only the matching text returns to its default spacing.
5. Enable custom typography and repeat the spacing cycle.
   - [ ] The custom font is kept and the spacing still applies and resets.
6. iOS: for each spacing value, scroll until the large title collapses, then
   return to the top.
   - [ ] Native collapse works, and the compact and large titles each keep
         their own spacing.
7. Push Details and cycle the spacing there.
   - [ ] The title spacing applies on Android and iOS.
   - [ ] iOS: the back button title follows the spacing, with and without
         custom typography, and with "Disable back button menu" on.
8. iOS: go back, enable "Long title", push Details again and cycle the spacing.
   - [ ] Without custom typography or a disabled back button menu, the long
         back title still shortens natively (to "Back" or just the chevron) when
         there isn't enough space.
9. iOS: on Details, slowly swipe back, cancel once, then complete the gesture.
   Push again and use the native back button. Repeat after collapsing the root
   title (use the push button at the bottom of the list).
   - [ ] Both return paths keep the root title's spacing and scroll state.
10. iOS: enable the search bar and repeat the spacing cycle and collapse. Focus
    search, type a query, cancel, then disable the search bar.
    - [ ] Search remains usable and the large title keeps its spacing.
11. iOS: disable custom typography and search. Compare omitted with `-0.9` at
    the default text size and at a large Dynamic Type size.
    - [ ] The title scales the same way in both; only its spacing differs.
          Letter spacing alone doesn't replace the system font.
