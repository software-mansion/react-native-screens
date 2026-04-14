# Test Scenario: More Navigation Controller

## Details

**Description:** Test cover checks on 

**E2E test:** ongoing research

## Technical information

**PR introducing functionality:** [#3785](https://github.com/software-mansion/react-native-screens/pull/3785) [#3813](https://github.com/software-mansion/react-native-screens/pull/3813) refactor: [#3875](https://github.com/software-mansion/react-native-screens/pull/3875) [#3877](https://github.com/software-mansion/react-native-screens/pull/3877)

**OS test creation version:** iOS18.6 and iOS26.2

## Prerequisites

- iOS device or simulator: iPhone and iPad (iOS18.6 and iOS26.2)

## Note

- On iPad: to display **More** tab - app window size has to correspond to iPhone view. To resize app on iOS18 and lower split view with other app has to be trigger.
- New toast should appear only after steps where expected section mention this.

## Steps - iPhone

### Baseline

1. Launch the app and navigate to the **More navigation controller** scenario.

- [ ] Expected: Tab bar shows **First**, **Second**, **Third**, **Fourth**, and **More**. The **First** tab is selected. The content area displays `First` as the route key.

---

### More tab — tap interaction

2. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. On the bottom green toast appear with `onMoreTabSelected` message.

3. Tap **Fifth** in the More screen list.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

4. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates. Route key label reads `Third`.

5. Tap the **More** tab in the tab bar.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. Tab bar selection updates - More tab is selected.

6. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

7. Tap **Sixth** in the More screen list.

- [ ] Expected: The **Sixth** tab content is shown. The route key label reads `Sixth`.

---

### Navigation using buttons

8. Tap **"Select Fourth"**.

- [ ] Expected: **Fourth** tab becomes active. Tab bar selection updates. Route key label reads `Fourth`.

9. Tap **"Select Fifth"**.

- [ ] Expected: **Fifth** tab content is shown. Route key label reads `Fifth`. The More tab is selected in the tab bar. No crash or blank screen.

10. From any visible tab (e.g. **First**), tap **"Select Sixth"**.

- [ ] Expected: **Sixth** tab content is shown. Route key label reads `Sixth`. The More tab is selected in the tab bar.

---

### Round-trip navigation

11.  Tap through tabs in this order using the select buttons: **First** → **Sixth** → **Second** → **Fifth** → **Third**.

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. Tabs behind More (Fifth, Sixth, More) show the More tab as selected. No visual glitches or stale route key labels.

---

## Steps - iPad

### Baseline - without More navigation controler displayed

1. Open app on iPad in full size and navigate to the **More navigation controller** scenario.

- [ ] Expected: Tab bar shows all six tabs. The **First** tab is selected. The content area displays `First` as the route key.

2. Navigate between tabs using tab items from tab bar.

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. No visual glitches or stale route key labels.

3.  Navigate between tabs using buttons from screen. 

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. No visual glitches or stale route key labels.

---

### More tab — tap interaction

4. Select `First` tab and resize app to iPhone size view.

- [ ] Expected: Tab bar shows **First**, **Second**, **Third**, **Fourth**, and **More**. The **First** tab is selected. The content area displays `First` as the route key.

5. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. On the bottom green toast appear with `onMoreTabSelected` message.

6. Tap **Fifth** in the More screen list.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

7. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates. Route key label reads `Third`.

8. Tap the **More** tab in the tab bar.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. Tab bar selection updates - More tab is selected.

9. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

10. Tap **Sixth** in the More screen list.

- [ ] Expected: The **Sixth** tab content is shown. The route key label reads `Sixth`.

---

### Navigation with app resizing 

11. Tap **Second** tab in the tab bar.

- [ ] Expected: **Second** tab becomes active. Tab bar selection updates. Route key label reads `Second`.

12. Tap **"More"** tab bar item and select **"Sixth"** from the More list.

- [ ] Expected: **Sixth** tab content is shown. Route key label reads `Sixth`. The More tab is selected in the tab bar. No crash or blank screen.

13. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

14. Resize app to full size.

- [ ] Expected: More tab disappear, tab bar shows all six tabs on top of the screen. **Second** tab becomes active. Route key label reads `Second`.

15. Select **Third** tab and switch to **Fifth**

- [ ] Expected: **Fifth** tab is selected. Route key label reads `Fifth`.

16. Resize app to iPhone size view.

- [ ] Expected: **More** tab appears and becomes active. Route key label reads `Fifth`.

17. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs. New green toast appear with `onMoreTabSelected` message.

18. Resize app to full size.

- [ ] Expected: More tab disappear, tab bar shows all six tabs on top of the screen. **Second** tab becomes active. Route key label reads `Second`.
