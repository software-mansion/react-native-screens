# Test Scenario: Stack Header Bar Minimization (iOS)

## Details

**Description:** Tests navigation bar minimization configuration exposed through
the `minimizationBehavior` and `restorationBehavior` header config props. A
single stack screen hosts a long scroll view with both pickers at its top.

**OS test creation version:** 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator with iOS 27 or higher

## Note

On iOS < 27 the props are ignored and a warning is logged for any value other
than `automatic`.

`restorationBehavior: atScrollEdge` is honored by the system only together with
`minimizationBehavior: onScrollDown`. With other behaviors it falls back to
`automatic`.

## Steps

1. Navigate to **Stack v5 → Stack Header Bar Minimization (iOS)**.

    - [ ] The `minimizationBehavior` picker is set to `automatic`.
    - [ ] The `restorationBehavior` picker is set to `automatic`.

2. Scroll down, then back up to the top.

    - [ ] The header does NOT minimize during either scroll.

3. Set `minimizationBehavior` to `never` and scroll down, then back up.

    - [ ] The header does not minimize during either scroll.

4. Set `minimizationBehavior` to `onScrollDown` and scroll down to around row 50.

    - [ ] The navigation bar minimizes.

5. Scroll up to around row 30.

    - [ ] The navigation bar restores.

6. Scroll to the top and set `restorationBehavior` to `atScrollEdge`. Scroll down to around row 50.

    - [ ] The navigation bar minimizes.

7. Scroll up to around row 30.

    - [ ] The navigation bar does NOT restore.

8. Scroll up to the top.

    - [ ] The navigation bar restores.

9. Set `minimizationBehavior` to `onScrollUp` and `restorationBehavior` to `automatic`. Scroll down to around row 50.

    - [ ] The navigation bar does NOT minimize.

10. Scroll up to around row 30.

    - [ ] The navigation bar minimizes.

11. Scroll up to the top.

    - [ ] The navigation bar restores.

12. Set `restorationBehavior` to `atScrollEdge`. Scroll down to around row 50.

    - [ ] The navigation bar does NOT minimize.

13. Scroll up to around row 30.

    - [ ] The navigation bar minimizes.

14. Scroll up to the top.

    - [ ] The navigation bar restores.
