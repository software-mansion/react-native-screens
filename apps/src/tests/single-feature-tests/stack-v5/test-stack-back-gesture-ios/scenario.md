# Test Scenario: Stack Back Gesture

## Details

**Description:** Verify `backGestureEnabled` and `fullScreenBackGestureEnabled`
of `Stack.Screen`: a refused swipe leaves the screen where it is, an allowed one
pops it, the header back button pops regardless, and a nested stack with hidden
headers pops one screen at a time, while a refused swipe on its top screen pops
the outer stack.

**OS test creation version:** iOS 18.6 and 27.2.

## E2E test

Incomplete: no step is automated. For manual testing perform all steps.

The edge swipe is not available in Detox.

## Prerequisites

- iPhone: simulator or device.
- Run this scenario as a top-level FabricExample screen: replace `apps/App.tsx`
  temporarily with
  `export { default } from './src/tests/single-feature-tests/stack-v5/test-stack-back-gesture-ios';`.
  Inside the in-app menu, the menu's own stack pops on a refused swipe.

## Note

- Wait for every animation to finish before the next action.
- Below iOS 26 the system has no back swipe from the middle of the screen.

## Steps

### Baseline

1. Launch the app, then tap "Push Blue".

   - [ ] "Blue" is shown with a header and a back button.
   - [ ] The switches read "backGestureEnabled: true" and
         "fullScreenBackGestureEnabled: true".

2. Swipe from the left screen edge to the right screen edge.

   - [ ] "Blue" follows the finger and "Home" is shown.

---

### Back gesture off

1. Tap "Push Blue", toggle "backGestureEnabled" off, then swipe from the left
   screen edge to the right screen edge.

   - [ ] "Blue" stays in place.

2. Swipe from the middle of the screen to the right screen edge.

   - [ ] "Blue" stays in place.

3. Tap the header back button.

   - [ ] "Home" is shown.

4. Tap "Push Blue", toggle "backGestureEnabled" off, then on, then swipe from
   the left screen edge to the right screen edge.

   - [ ] "Blue" follows the finger and "Home" is shown.

---

### Hidden header

1. Tap "Push Hidden".

   - [ ] "Hidden" is shown without a header.

2. Swipe from the left screen edge to the right screen edge.

   - [ ] "Hidden" follows the finger and "Home" is shown.

3. Tap "Push Hidden", toggle "backGestureEnabled" off, then swipe from the left
   screen edge to the right screen edge.

   - [ ] "Hidden" stays in place.

4. Tap "Pop".

   - [ ] "Home" is shown.

---

### Nested stack with hidden headers

1. Tap "Push Nested", then tap "Push Inner Blue".

   - [ ] "Inner Blue" is shown below the "Nested" strip, without a header.

2. Swipe from the left screen edge to the right screen edge.

   - [ ] "Inner Blue" follows the finger and "Inner Home" is shown below the
         "Nested" strip.

3. Swipe from the left screen edge to the right screen edge.

   - [ ] The "Nested" strip and "Inner Home" follow the finger and "Home" is
         shown.

4. Tap "Push Nested", tap "Push Inner Blue", toggle "backGestureEnabled" off,
   then swipe from the left screen edge to the right screen edge.

   - [ ] The "Nested" strip and "Inner Blue" follow the finger and "Home" is
         shown.

---

### Full-screen gesture off

1. Tap "Push Blue", toggle "fullScreenBackGestureEnabled" off, then swipe from
   the middle of the screen to the right screen edge.

   - [ ] "Blue" stays in place.

2. Swipe from the left screen edge to the right screen edge.

   - [ ] "Blue" follows the finger and "Home" is shown.

3. Tap "Push Blue", then swipe from the middle of the screen to the right
   screen edge.

   - [ ] iOS 26 and later: "Blue" follows the finger and "Home" is shown.
   - [ ] iOS 18: "Blue" stays in place (see Note).
