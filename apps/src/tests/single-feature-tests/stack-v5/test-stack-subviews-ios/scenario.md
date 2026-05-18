# Test Scenario: Header Subviews

## Details

**Description:** This test focuses on handling custom subviews in the header on iOS.
The test focuses on correct ShadowNode updates, i.e. React views located in the exact same place as native views,
with correct handling of pressables: in / out / press. The implementation should correctly handle items being added,
removed and resized.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

Other: feature is WiP, e2e is TODO

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

- on iOS 26, view may move to overflow menu if there is no space for them, iOS 18 tries to render all of them (including the header)
- spacers on iOS 26 work only to split the glass "bubble" around the item, setting width only works on iOS < 26
- `subtitle`, `largeSubtitle` is only supported on iOS 26
- custom view buttons don't move to overflow menu (native behavior); one needs to specify `menuRepresentation` for them (not implemented yet)
- items are collapsed in the order: title, trailing buttons (one by one), leading buttons (all at once); this is in line with native behavior
- on iOS 26, the title (both regular and custom) moves from center to the leading edge if trailing buttons would otherwise touch it
- the regular title seems to be present even if large title is enabled on iOS 18
- the test adds an option for changing the hit slop, but this remains to be handled in the future on the native side (TODO)
- for now, large subtitle view on iOS 26 doesn't respond to clicks (TODO)

## Steps

1. On both iOS 18 and 26
- Open Dev Console
- Reload the application (dev console causes some layout-related callbacks to trigger which may hide regressions)
- [ ] Verify that the position of items on devices matches element tree
- [ ] Click "Toggle leading/trailing items count" to add items. Verify that positions match element tree.
- [ ] Set title to be `view`. Verify that positions match element tree.
- [ ] Click on header items to force other items to move. Verify that positions match element tree.
- [ ] Rotate the screen to landscape. Verify that positions match element tree.
- [ ] Rotate the screen back to portrait. Verify that positions match element tree.
- [ ] Click "Toggle leading items count" to remove all leading items. Verify that positions of still present items match element tree.
- [ ] Click "large header enabled" to show large header. You may need to scroll down. Verify that:
  - [ ] On iOS 18, regular title is still present and item positions match element tree.
  - [ ] On iOS 26, regular title is removed whenever large title shows and item positions match element tree. You may need to remove some items to give space for the regular title.

2. On iOS 26
- [ ] Set subtitle to `view`. Verify that its position matches element tree.
