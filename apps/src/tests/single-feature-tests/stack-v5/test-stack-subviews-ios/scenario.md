# Test Scenario: Header Subviews (iOS)

## Details

**Description:** This test focuses on handling custom subviews in the header on iOS.
The test focuses on correct ShadowNode updates, i.e. React views located in the exact same place as native views,
with correct handling of pressables: in / out / press. The implementation should correctly handle items being added,
removed and resized.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

TBD

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

- "Position of items on device matches element tree" means that the DevTools overlay the item highlight with correct position and size. Alternatively, this could be checked by pressing and moving the cursor over the button to see if the whole visible area works, not triggering onPressOut immediately
- on iOS 26, view may move to overflow menu if there is no space for them, iOS 18 tries to render all of them (including the header)
- spacers on iOS 26 work only to split the glass "bubble" around the item, setting width only works on iOS < 26
- `subtitle`, `largeSubtitle` is only supported on iOS 26
- custom view buttons don't move to overflow menu (native behavior); one needs to specify `menuRepresentation` for them (not implemented yet)
- items are collapsed in the order: title, trailing buttons (one by one), leading buttons (all at once); this is in line with native behavior
- on iOS 26, the title (both regular and custom) moves from center to the leading edge if trailing buttons would otherwise touch it
- the regular title seems to be present even if large title is enabled on iOS 18
- the test adds an option for changing the hit slop, but this remains to be handled in the future on the native side (TODO)
- for now, large subtitle view on iOS 26 doesn't respond to clicks (TODO)

## Steps on iPhone

1. Open Dev Console
2. Reload the application (dev console causes some layout-related callbacks to trigger which may hide regressions)
3. Verify first layout.
  - [ ] Position of items on device matches element tree.
4. Click "Toggle leading/trailing items count" to add items. Verify layout.
  - [ ] Position of items on device matches element tree.
5. Set title to `view`. Verify layout.
  - [ ] Position of items on device matches element tree.
6. Set subtitle to `view`. Verify layout.
  - [ ] on iOS 26, position of items on device matches element tree.
7. Click on header items to resize and force other items to move. Verify layout.
  - [ ] Position of items on device matches element tree.
8. Rotate the screen to landscape. Verify layout.
  - [ ] Position of items on device matches element tree.
9. Rotate the screen back to portrait. Verify layout.
  - [ ] Position of items on device matches element tree.
10. Click "Toggle leading items count" to remove all leading items. Verify layout.
  - [ ] Position of items on device matches element tree.
11. Click "large header enabled" to show large header. You may need to scroll down.
  - [ ] Regular title is removed whenever large title shows and item positions match element tree. You may need to remove some items to give space for the regular title.
12. Set title to `long` and `largeTitle` to short. Scroll to reveal large title.
  - [ ] on iOS 18, largeTitle should be long
  - [ ] on iOS 26, largeTitle should be short
13. Set largeTitle to `none`.
  - [ ] on iOS 26, largeTitle should be long

## Steps on iPad

1. Open Dev Console
2. Reload the application (dev console causes some layout-related callbacks to trigger which may hide regressions)
3. Verify first layout.
  - [ ] Position of items on device matches element tree.
5. Set title to `view`. Verify layout.
  - [ ] Position of items on device matches element tree.
4. Resize the application. Verify layout.
  - [ ] Position of items on device matches element tree.
