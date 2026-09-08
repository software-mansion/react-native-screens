# Test Scenario: Stack Header Item Appearance (iOS)

## Details

**Description:** This test focuses on the appearance of regular header items:
regular, disabled, prominent and prominent disabled, and on the button /
prominent button text attributes configured via `standardAppearance` and
`scrollEdgeAppearance`.

**OS test creation version:** iOS 26.5, iPadOS 26.5

## E2E test

TBD

## Prerequisites

- iOS / iPadOS simulator

## Note

- runtime changes of appearance don't work on iOS 26, but does work on 18 and works partially on 27 (only color doesn't)
- runtime switch between `standardAppearance` and `scrollEdgeAppearance` doesn't work on iOS 26
- menu overflow doesn't appear on iOS 18 by default, some steps won't work

## Steps on iPhone (best test on iOS 27)

1. Inspect the header trailing items

- [ ] Four items with "1", "2", "3", "4" circled sfSymbols are visible

- [ ] Item "1" is displayed as a regular, enabled item

- [ ] Item "2" is grayed out (disabled)

- [ ] Item "3" is displayed as a prominent item (tinted background; bold on iOS < 26)

- [ ] Item "4" is displayed as a prominent item and grayed out (disabled)

2. Tap items "1" and "3"

- [ ] A toast appears for each tap

3. Tap items "2" and "4"

- [ ] Disabled items do not react to touches (no highlight, no toast)

4. Tap "Push to overflow", then open the overflow menu

- [ ] Items "1"-"4" are moved to the overflow menu

5. Toggle off "Push to overflow", then enable "Use text items"

- [ ] Items render short text labels "aa" (regular), "bb" (disabled), "cc"
      (prominent), "dd" (prominent disabled) instead of sfSymbols

6. Enable "standardAppearance" and configure the "button" slot (e.g. red color,
   italic style)

- [ ] Text of item "aa" changes accordingly

- [ ] Text of item "bb" changes with additional gray tint (disabled)

7. Configure the "prominentButton" slot (e.g. blue color, fontSize 12)

- [ ] Text of item "cc" changes accordingly

- [ ] Text of item "dd" changes with additional gray tint (disabled)

8. Tap "Push details screen"

- [ ] All four items and the back button fit on the screen

- [ ] The back button title follows the "button" slot configuration

9. On the details screen, enable "scrollEdgeAppearance" and configure the slots
   differently from "standardAppearance", then scroll the content

- [ ] When scrolled to top, all items follow the `scrollEdgeAppearance` configuration

- [ ] Otherwise, all items follow the `standardAppearance` configuration

10. Configure the "button (disabled)" and "prominentButton (disabled)" slots
    for both `standardAppearance` and `scrollEdgeAppearance`

- [ ] The change is seen on buttons "bb" and "dd"

- [ ] The styling is different when scrolled to top and when scrolled in the middle

- [ ] Items "aa" and "cc" are unaffected and behave as in 9.

11. Configure the "button (highlighted)" and "prominentButton (highlighted)" slots
    for both `standardAppearance` and `scrollEdgeAppearance`

- [ ] The style is visible when the button "aa" and "cc" is being pressed

- [ ] The style is NOT visible when the button "bb" and "dd" is being pressed (disabled)

12. Set "item tintColor" to red

- [ ] Enabled items "1" and "3" are tinted red (with sfSymbols: icon color;
      with text items: for prominent items on iOS 26 tint affects the
      emphasized background, otherwise the text color)

- [ ] Disabled items keep the system disabled look
