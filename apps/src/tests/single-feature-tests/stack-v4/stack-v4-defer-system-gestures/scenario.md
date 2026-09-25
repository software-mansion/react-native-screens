# Test Scenario: Defer system gestures

## Details

**Description:** This test verifies the `screenEdgesDeferringSystemGestures` prop of the v4 `Screen`, which maps to `UIViewController.preferredScreenEdgesDeferringSystemGestures`. On a deferred edge the system's own edge gesture (swipe up for the home screen on the bottom edge, swipe down for Notification Centre on the top edge) does not fire on the first swipe — the touch is delivered to the app instead, and only a second swipe from the same edge invokes the system gesture. The success criteria are that a swipe from the configured edge reaches the app rather than backgrounding it, that the other edges keep their system behaviour, and that switching the picker back to `none` restores the system gesture immediately.

**OS test creation version:** iOS 26

## E2E test

Incomplete — the system home / Notification Centre gestures are owned by the OS and are not reproducible from Maestro.

## Prerequisites

- iOS device or simulator with a home indicator (no hardware home button).

## Note

iOS only defers a gesture that has not begun yet, so the prop has to be set before the touch lands. Setting it from inside a gesture handler has no effect on the gesture in flight.

The system draws an "arrow" affordance over the deferred edge after the first swipe, which is expected.

## Steps

1. Open the test. `edge` is `bottom` by default.

- [ ] The screen shows `screenEdgesDeferringSystemGestures: [bottom]` and a strip along the bottom edge.

2. Swipe up slowly from the very bottom edge of the screen.

- [ ] The app stays in the foreground and the touch counter increases by one.
- [ ] The home indicator turns into the system's deferral affordance.

3. Swipe up from the bottom edge a second time, without waiting.

- [ ] The app goes to the background (the system gesture wins the second swipe).

4. Re-open the app, set `edge` to `none`, and swipe up from the bottom edge.

- [ ] The app goes to the background on the first swipe and the counter does not increase.

5. Set `edge` to `top` and swipe down from the very top edge.

- [ ] Notification Centre does not open on the first swipe.

6. Set `edge` to `all` and repeat steps 2 and 5.

- [ ] Both the bottom and the top edge defer their system gesture.
