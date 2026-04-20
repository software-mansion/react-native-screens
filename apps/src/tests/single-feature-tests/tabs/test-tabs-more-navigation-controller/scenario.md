# Test Scenario: More Navigation Controller

## Details

**Description:**  Validates the native iOS More navigation controller - the overflow mechanism UIKit creates when a tab bar has more than five tabs. Tests cover user-driven and JS-driven navigation to overflow tabs (Fifth, Sixth), correct onMoreTabSelected event lifecycle (fires only when opening the More list, not on subsequent selections within it), and iPad resize transitions between compact and regular size classes.

**OS test creation version:** iOS: 18.6 and 26.2

## E2E test

Other: Ongoing research.

## Prerequisites

- iOS device or simulator: iPhone and iPad (iOS18.6 and iOS26.2)

## Note

- On iPad: The More tab only appears when the window is resized to a compact width size class. For iOS 18 and older, a Split View must be triggered to achieve this.

- Toasts: A blue toast with the message `onTabSelected:"<selected tab name>"` should appear after each tab selection - except when the More tab list is displayed (which triggers a green `onMoreTabSelected` toast instead). In this scenario, this action is only mentioned in steps involving non-intuitive situations.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **More navigation controller** scenario.

- [ ] Expected: Tab bar shows **First**, **Second**, **Third**, **Fourth**, and **More**. The **First** tab is selected. The content area displays `First` as the route key.

---

### More tab — tap interaction

2. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. A green toast appears at the bottom with the message `onMoreTabSelected`.

3. Tap **Fifth** in the More screen list.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

4. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates, and the route key label reads `Third`.

5. Tap the **More** tab in the tab bar.

- [ ] Expected: The Fifth tab content is displayed, and the route key label reads `Fifth`. The Tab Bar updates to show that the More tab is selected.

6. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

7. Tap **Sixth** in the More screen list.

- [ ] Expected: The **Sixth** tab content is shown. The route key label reads `Sixth`.

---

### Navigation using buttons

8. Tap **"Select Fourth"**.

- [ ] Expected: **Fourth** tab becomes active. Tab bar selection updates, and the route key label reads `Fourth`.

9. Tap **"Select Fifth"**.

- [ ] Expected: **Fifth** tab content is shown, and the route key label reads `Fifth`. The More tab is selected in the tab bar. No crash or blank screen.

10.  Tap **"Select First"** and then tap **"Select Sixth"**.

- [ ] Expected: **Sixth** tab content is shown, and the route key label reads `Sixth`. The More tab is selected in the tab bar.

---

### Round-trip navigation

11.  Tap through tabs in this order using the select buttons: **First** → **Sixth** → **Second** → **Fifth** → **Third**.

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. Tabs behind More (Fifth, Sixth) show the More tab as selected. No visual glitches or stale route key labels.

## Steps - iPad

### Baseline - without More navigation controler displayed

1. Open app on iPad in full size and navigate to the **More navigation controller** scenario. Open DevTools.

- [ ] Expected: Tab bar shows all six tabs. The **First** tab is selected. The content area displays `First` as the route key.

2. Navigate between tabs using tab items from tab bar.

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. No visual glitches or stale route key labels.

3.  Navigate between tabs using buttons from screen.

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. No visual glitches or stale route key labels.

---

### More tab — tap interaction with app resizing

4. Select `First` tab and resize app to iPhone size view.

- [ ] Expected: Tab bar shows **First**, **Second**, **Third**, **Fourth**, and **More**. The **First** tab is selected. The content area displays `First` as the route key.

5. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. A green toast appears at the bottom with the message `onMoreTabSelected`.

6. Tap **Fifth** in the More screen list.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

7. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates, and the route key label reads `Third`.

8. Tap the **More** tab in the tab bar.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. Tab bar selection updates - More tab is selected.

9. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

10.  Tap **Second** tab in the tab bar.

- [ ] Expected: **Second** tab becomes active. Tab bar selection updates, and the route key label reads `Second`. A blue toast appears at the bottom with the message `onTabSelected:"Second"`.

11.  Tap **"More"** tab bar item and select **"Sixth"** from the More list.

- [ ] Expected: **Sixth** tab content is shown, and the route key label reads `Sixth`. The More tab is selected in the tab bar. No crash or blank screen.

12. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

13. Resize app to full size.

- [ ] Expected: The More tab disappears, and the tab bar shows all six tabs at the top of the screen. The **Second** tab becomes active, and the route key label reads `Second`.

14.  Select **Third** tab and switch to **Fifth**

- [ ] Expected: **Fifth** tab is selected, and the route key label reads `Fifth`.

15. Resize app to iPhone size view.

- [ ] Expected: **More** tab appears and becomes active, and the route key label reads `Fifth`.

16. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

17. Resize app to full size.

- [ ] Expected: More tab disappear, tab bar shows all six tabs on top of the screen. **Fifth** tab becomes active, and the route key label reads `Fifth`.
