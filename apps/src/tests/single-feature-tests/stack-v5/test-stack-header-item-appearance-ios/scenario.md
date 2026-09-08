# Test Scenario: Stack Header Item Appearance (iOS)

## Details

**Description:** This test focuses on the appearance of regular header items:
regular, disabled, prominent and prominent disabled, and on the button /
prominent button / back button text attributes configured via
`standardAppearance` and `scrollEdgeAppearance`.

**OS test creation version:** iOS 26.5, iPadOS 26.5

## E2E test

TBD

## Prerequisites

- iOS / iPadOS simulator

## Notes

1. **iOS 26 — appearance resolves only when items attach.** UIKit ignores
   runtime reassignment of `standardAppearance` / `scrollEdgeAppearance` and
   standard <-> scroll-edge transitions for already-attached bar button items.
   After toggling any style preset, double tap Use text items.
2. **Unset backButton attributes inherit the buttons style** (verified on
   iOS 18, 26 and 27). UIKit derives `backButtonAppearance` from
   `buttonAppearance`, so a backButton appearance that sets only the color
   keeps e.g. the italic style of the buttons. A long press (~0.4 s) on the
   back button opens the back navigation menu (also on iOS 18), which ends
   the highlighted-state window — release before it appears.
3. menu overflow doesn't appear on iOS 18 by default, some steps won't work

`tintColor` is an item property, not part of the appearance — it updates at
runtime on both iOS 26 and 27.

## Steps on iPhone (Pro Max versions)

All style presets are enabled by default, so the very first step verifies the
whole configuration as applied at attach time (no runtime changes involved).

1. Launch the scenario and inspect the header (the content starts at the
   scroll edge)

    - [ ] "aa" is green at 22pt (the `scrollEdgeAppearance` buttons style)
    
    - [ ] "cc" is teal with the default font (prominent buttons style)
    
    - [ ] Disabled items "bb" and "dd" are red (iOS 26/27 additionally dim
          them with a gray tint; iOS 18 shows the full color)

2. Scroll the content away from the top

    - [ ] On iOS 18/27, "aa" turns dark red italic and "bb" thin (100) purple
          (`standardAppearance`)
    
    - [ ] On iOS 26, all items keep the scroll-edge style (see Note #1)

3. Press and hold items "aa" and "cc", one at a time

    - [ ] The pressed item's text shows blue (magenta when at the
          scroll edge), dimmed by the system press effect
    
    - [ ] No change is visible while "bb" or "dd" is being pressed (disabled)

4. Tap items "aa" and "cc", then "bb" and "dd"

    - [ ] A toast appears for "aa" and "cc"
    
    - [ ] Disabled items do not react to touches (no toast)

5. Tap "Push details screen"

    - [ ] The items are styled as in steps 1-2 (fresh attach)
    
    - [ ] The back button title is deep pink; on iOS 26+ the title shows
          when device is horizontal, standard is italics, edge is regular font

6. Pop to the first screen. Scroll away from the edge, toggle "Style buttons (red italic)" off

    - [ ] On iOS 27, "aa"/"bb" lose the custom style ("bb" keeps only the thin purple);
          iOS 26 requires rerender to catch this (double tap Use text items)
    
    - [ ] Toggle it back on — the style is back (iOS 26 workaround applies)

7. Disable "Use text items"

    - [ ] Items render circled sfSymbols "1"-"4" instead of text; the icons
          are not affected by the text attributes
    
    - [ ] Item "3" is displayed as a prominent item (tinted background; bold
          on iOS < 26) and item "4" as prominent disabled

8. Tap "Push to overflow", then open the overflow menu

    - [ ] Items "1"-"4" are moved to the overflow menu

    - [ ] Items "Regular" and "Prominent" react to touches, whereas "Disabled" and "Prominent Disabled" don't

9. Toggle off "Push to overflow"

    - [ ] Items "1"-"4" are back in the header

10. Enable "Tint items (red)"

    - [ ] Item "1" symbol is tinted red
    
    - [ ] Item "3" background is tinted red
    
    - [ ] Disabled items keep the system disabled look
    
    - [ ] The tint applies immediately on both iOS 26 and 27

11. Enable "Use text items" again, keeping the tint on

    - [ ] The "aa" label prioritizes the appearance styles over tint color

    - [ ] The "cc" bubble stays tinted red while the label colors keep
          following the appearance styles
    
    - [ ] Disable "Tint items (red)" — the bubble returns to the default tint

12. Press and hold the back button

    - [ ] During the initial press the title shows dark cyan
    
    - [ ] When released, after dismissing the menu, the title returns to deep pink

13. Toggle "Style back button (deep pink)" off, then pop and re-push the
    details screen

    - [ ] The back button title follows the buttons style again: green 22pt
          at the scroll edge, red italic after scrolling away on both iOS 26 and 27
    
    - [ ] Toggle it back on and re-push — the title is deep pink again
