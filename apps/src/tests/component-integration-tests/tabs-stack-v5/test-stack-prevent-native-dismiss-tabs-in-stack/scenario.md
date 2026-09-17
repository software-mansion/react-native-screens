# Test Scenario: Prevent Native Dismiss - Tabs in Stack

## Details

**Description:** Verify Android system back with a `preventNativeDismiss`
screen inside a v5 Stack nested in a Tab, itself nested in an outer v5 Stack.
The selected tab's stack pops on system back, its preventing root intercepts
system back, an unselected tab's preventing screen does not, and a screen
pushed on the outer stack above the tabs host pops normally even though the
preventing screen below it stays alive. Also verifies that interception
survives a tab switch and an activity restart.

**OS test creation version:** Android API Level 36.

## E2E test

TBD. Every step drives the system gesture-back, so the scenario is manual for
now.

## Prerequisites

- Android emulator or device with **Gesture navigation** enabled
  (**Settings → Navigation mode → Gesture navigation**).

### Android launch

- Run the screen **directly** by editing [apps/App.tsx](../../../../../App.tsx):
  import and render `TestStackPreventNativeDismissTabsInStack` as the root
  component instead of `Example`, e.g.:

  ```tsx
  import { TestStackPreventNativeDismissTabsInStack as Example } from './src/tests/component-integration-tests/tabs-stack-v5';
  ```

  When the screen is nested inside the example app's own navigation, native
  back navigates out to the selection menu instead of reaching the stack
  (issue
  [#1459](https://github.com/software-mansion/react-native-screens-labs/issues/1459)).

## Note

- Layout: outer stack `Home` → `A` / `TabsHost`. `TabsHost` renders tabs
  `Tab1` / `Tab2`. `Tab1` hosts a nested stack `N1` (prevent **Enabled**,
  toast "Native dismiss prevented - N1") → `N2` (prevent **Disabled**). `Tab2`
  is a plain view. Every nested screen offers **Push N2** / **Pop** / **Toggle
  Prevent Native Dismiss** / **Push A (outer)**; the last one pushes `A` on the
  **outer** stack, above `TabsHost`.
- Android keeps covered stack screens resumed with their views attached. A
  container's system back veto is therefore enabled only while its top screen
  prevents **and** the container sits on the active navigation path: its host
  screen is the top of every enclosing stack and its tab is selected. This is
  the same rule `FragmentManager` applies to its own pop callbacks, which is
  also what lets system back pop inside the selected tab's stack
  ([#1774](https://github.com/software-mansion/react-native-screens-labs/issues/1774)).
- `Key` values use a session-global counter that never resets - only verify
  relationships.

## Steps

### Baseline

1. Launch the app directly via `App.tsx`.

- [ ] **Home** is shown (blue background), no header. **Push A** /
      **Push TabsHost** buttons, no **Pop**.

### System back inside the selected tab's stack

2. Tap **Push TabsHost**.

- [ ] A screen with a header titled "Tabs" and a back chevron is pushed. A
      tab bar with **Tab1** / **Tab2** is shown, **Tab1** selected. Its
      content is **N1** (green background, header "N1", no chevron) showing
      `Name: N1`, a `Key`, **Prevent native dismiss: Enabled**, and the
      **Push N2** / **Pop** / **Toggle Prevent Native Dismiss** / **Push A
      (outer)** buttons.

3. On **N1**, perform a system gesture-back (swipe from the left edge).

- [ ] Intercepted: a green toast "Native dismiss prevented - N1" appears and
      the app stays on **N1** inside **Tab1**. If **TabsHost** pops to
      **Home** instead, the selected tab is not the primary navigation
      fragment.

4. On **N1**, tap **Push N2**. On **N2** (prevent Disabled, header "N2" with a
   back chevron), perform a system gesture-back.

- [ ] **N2** pops back to **N1** within the tab's stack. No toast. N1's `Key`
      is unchanged.

### An unselected tab does not veto

5. Select **Tab2**, then perform a system gesture-back.

- [ ] **TabsHost** pops back to **Home**. No toast: the preventing **N1**
      sits in an unselected tab and gets no vote.

### Interception survives a tab switch

6. Tap **Push TabsHost**. Select **Tab2**, then **Tab1** again, then perform a
   system gesture-back on **N1**.

- [ ] Intercepted: the "Native dismiss prevented - N1" toast appears; the app
      stays on **N1**.

### A covered branch does not veto (outer push above the tabs host)

7. On **N1**, tap **Push A (outer)**.

- [ ] Screen **A** (yellow background, header "A" with a back chevron) is
      pushed on the **outer** stack, above **TabsHost**.

8. On **A**, perform a system gesture-back.

- [ ] **A** pops back to **TabsHost** showing **Tab1** / **N1**. No toast.
      Before the fix this gesture was intercepted by **N1** and **A** stayed.

9. On **N1**, perform a system gesture-back.

- [ ] Intercepted again: toast shown, the app stays on **N1**. The veto
      re-arms as soon as its branch is active again.

10. On **N1**, tap **Push A (outer)**. On **A**, tap the native header
    back-button chevron.

- [ ] **A** pops back to **TabsHost** / **N1**. No toast.

### Interception survives an activity restart

11. On **N1**, send the app to the background (swipe up to the launcher or
    press **Home**) and bring it back. Perform a system gesture-back.

- [ ] Intercepted: toast shown, the app stays on **N1**.

12. On **N1**, tap **Push A (outer)**. Background and foreground the app. On
    **A**, perform a system gesture-back, then another one on **N1**.

- [ ] **A** pops with no toast; the following gesture on **N1** is intercepted
      with its toast.

### A disabled nested root lets the tabs host pop

13. On **N1**, tap **Toggle Prevent Native Dismiss** so the label reads
    **Disabled**, then perform a system gesture-back.

- [ ] **TabsHost** pops back to **Home**. No toast: nothing in the selected
      tab's stack can be popped or vetoes.
