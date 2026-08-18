# Test Scenario: Header Subviews (Android)

## Details

**Description:** This test focuses on handling custom subviews in the header on Android. As subview layout and synchronization in Shadow Tree is sensitive to any changes to other props, nearly full configuration of the header is provided. It also drives `contentInsetStart` / `contentInsetEnd` under the "Content Insets" section, since those bound the same content area the subviews are laid out in.

**OS test creation version:** API 36

## E2E test

Other - the subview API is still subject to significant changes.

## Prerequisites

- Android emulator

## Note

This feature is still WIP.

### Known Issues/Important Observations

- entire hierarchy is rebuild when number of subviews is changed in runtime
- hierarchy rebuild causes a flash and resets scroll position
- text ellipsize in RTL does not work with subviews
- the content insets move the small title and the medium/large collapsed title,
  never the medium/large expanded one
- both insets are minimums, not offsets: the navigation icon and the menu are
  laid out before they apply, so `contentInsetStart` is inert once a back button
  is shown (push a screen) and `contentInsetEnd` is inert once the "menu items"
  picker adds an item

## Steps

This feature is still WIP. Step-by-step instructions will be provided when API stabilizes.
