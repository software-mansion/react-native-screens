# Test Scenario: Scroll to Top Guard Header Subviews (iOS)

## Details

**Description:** This test verifies the experimental `ScrollToTopGuard` component
(`react-native-screens/experimental`). On iPadOS 26+ and iPhone (iOS 27+) the system
scrolls the underlying `ScrollView` to top when the navigation bar area is tapped.
Wrapping a header subview in `<ScrollToTopGuard>` consumes that tap so the guarded
subview does NOT trigger scroll to top, while unguarded subviews and the bare header
area still do.

**OS test creation version:** iOS 27, iPadOS 26

## E2E test

TBD

## Prerequisites

- iOS / iPadOS simulator or device on **iPadOS 26+** or **iPhone iOS 27+**.

## Steps

1. Open the test. Scroll the list down so scroll-to-top is observable.
2. With **Left** `guarded` enabled (default), tap the **Left** subview.
  - [ ] The list does NOT scroll to top.
3. Toggle **Left** `guarded` off. Scroll down and tap the **Left** subview.
  - [ ] The list scrolls to top.
4. Scroll down and tap the **bare header area** (outside any subview).
  - [ ] The list scrolls to top.
5. With **Left** `hidesSharedBackground: true`, repeat steps 2–3.
  - [ ] Guarded Left does NOT scroll to top; unguarded Left does.
6. Repeat steps 2–3 for the **Right** subview.
  - [ ] Guarded Right does NOT scroll to top; unguarded Right does.
7. Repeat steps 2–3 for the **Title** subview.
  - [ ] Guarded Title does NOT scroll to top; unguarded Title does.
9. Set a guarded subview's `hitSlop` to `30`, `hidesSharedBackground: false`,
   scroll down, and tap just outside the subview.
  - [ ] The press is registered and the list does NOT scroll to top.
10. Repeat step 9 with `hidesSharedBackground: true`.
  - [ ] The press is registered and the list does NOT scroll to top.
