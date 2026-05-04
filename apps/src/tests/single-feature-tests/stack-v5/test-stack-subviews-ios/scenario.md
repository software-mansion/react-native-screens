# Test Scenario: Header Subviews

## Details

**Description:** This test focuses on handling custom subviews in the header on iOS.
The test focuses on correct ShadowNode updates, i.e. React views located in the exact same place as native views,
with correct handling of pressables: in / out / press.

**OS test creation version:** iOS 26.4, iPadOS 26.4

## E2E test

## Prerequisites

- iOS / iPadOS emulator

## Note (Optional)

Behavior of header item layout differs between iOS 18 and 26: 
- on iOS 26, view may move to overflow menu if there is no space for them, iOS 18 tries to render all of them
- spacers on iOS 26 work only to split the glass "bubble" around the item, setting width only works on iOS < 26
- `subtitle`, `largeSubtitle` is only supported on iOS 26

### Known Issues/Important Observations

- the test adds an option for changing the hit slop, but this remains to be handled in the future on the native side
- custom view buttons don't move to overflow menu (native behavior); one needs to specify `menuRepresentation` for them (not implemented yet)
- items are collapsed in the order: title, right buttons (one by one), left buttons (all at once); this is in line with native behavior

## Steps
