# Test Scenario: SVM in Stack & Tabs - tabs special effects

## Details

**Description:**
This test verifies interaction between `ScrollViewMarker`, `Stack` and `Tabs` components. 
The primary goal is to verify that the tabs special effects (scroll-to-top, pop-to-top) do work in 
nested container scenario.

**OS test creation version:** 
iOS: 26.5, Android: API Level 36.

## E2E test

Full: All manual test steps covered.

## Prerequisites

- iOS: simulator with iOS 15+ is enough,
- Android: emulator

## Note

Android does not yet support pop-to-root - it is unimplemented. Scroll-to-top should work.

iOS implementation doesn't currently support nested container interaction yet. 
This test needs to be updated after such interaction is supported.

## Steps

### Basic case - no nesting

1. Launch the app and navigate to the **SVM in Stack & Tabs - tabs special effects** screen.

    - [ ] There should be two tabs: `Home` and `Stack`.
    - [ ] `Home` tab should be selected.

2. Scroll down a bit.

    Doesn't really matter how much you scroll - the distance should be "noticeable". 

3. Press `Home` tab item (repeated tab selection) to trigger the special effect.

    - [ ] *scroll-to-top* should be triggered and you should observe the scroll-view scrolling 
    to its top.

### Nested stack

4. Change tab to `Stack`.

    - [ ] The `Stack` screen should be displayed. 
    - [ ] Scroll-view should be visible and scrolled to top.
    
5. Scroll down a bit.

    Doesn't really matter how much you scroll - the distance should be "noticeable". 

6. Press `Stack` tab item (repeated tab selection) to trigger the special effect.

    - [ ] *scroll-to-top* should be triggered and you should observe the scroll-view scrolling 
    to its top.
