# Nested scroll interop (Android)

Validates the optional Android nested-scroll delegate seam on Stack v5 without depending on any external package.

The FabricExample app installs a test-only delegate. The delegate can either observe the transaction without consuming distance or consume every pixel left after `react-native-screens` has run its own CoordinatorLayout behaviors. The scenario can also remove the factory entirely to exercise the production-default no-delegate path.

## Expected behavior

1. In **Observe** mode, a React Native `ScrollView` remains the source owner. Touch scroll and fling reach the external delegate, including `TYPE_NON_TOUCH` momentum callbacks, while the Stack v5 large header and content continue to move normally.
2. In **Consume remaining** mode, Stack v5 keeps first priority. Its large header can collapse, then the test delegate consumes the remaining distance before the child content moves.
3. Pushing `Details` creates a different screen/source pair. Popping back to `Home` restores the original pair.
4. With Stack v5 nested inside another Stack v5 screen, an inner delegate does not bypass the outer screen's native scroll behavior: the original target is bridged to the first accepting ancestor before the delegate sees the remainder.
5. The nested ancestor keeps first priority even when the inner delegate consumes the remainder.
6. Signed remaining distance is preserved in both directions, including reverse scroll used to expand a collapsed header.
7. A new touch transaction after momentum does not corrupt the independently tracked `TYPE_TOUCH` / `TYPE_NON_TOUCH` lifecycle.
8. When the delegate declines nested scroll, the seam is behaviorally inert.
9. With the factory removed entirely, newly created screens use the stock Stack v5 path without creating a delegate.
10. The test delegate never owns source fling physics; fling handlers return `false`.

## E2E coverage

The Android e2e test asserts:

- the delegate is attached to `StackScreen`, not the legacy screen implementation;
- touch and non-touch nested-scroll callbacks are delivered;
- observe mode consumes zero distance and the React Native scroll view moves;
- consume mode receives only the remaining distance after Stack v5 and prevents the child from moving while the native header is allowed to react first;
- push/back switches to a new screen/source and restores the original source on return;
- a large outer Stack v5 header still collapses when the source belongs to a nested Stack v5 whose external delegate accepts the transaction;
- with that nested source in consume mode, the outer ancestor collapses first and only the residual distance is consumed by the delegate;
- reverse scroll produces signed negative delegate consumption and expands the native header without moving the child;
- a fast momentum transaction followed by a new touch produces coherent touch/non-touch start/stop accounting and lifecycle ordering;
- disabling the delegate leaves the existing Stack v5 scroll behavior unchanged;
- removing the factory entirely before creating a new screen produces zero delegates and preserves stock scrolling behavior.
