# Test Scenario: Header Subviews

## Details

**Description:** This test focuses on handling custom subviews in the header on Android. As subview layout and synchronization in Shadow Tree is sensitive to any changes to other props, nearly full configuration of the header is provided.

**OS test creation version:** API 36

## E2E test

Other - the subview API is still subject to significant changes.

## Prerequisites

- Android emulator

## Note (Optional)

This feature is still WIP.

### Known Issues/Important Observations

- entire hierarchy is rebuild when number of subviews is changed in runtime
- hierarchy rebuild causes a flash and resets scroll position
- text ellipsize in RTL does not work with subviews

## Steps

This feature is still WIP. Step-by-step instructions will be provided when API stabilizes.
