# Test Scenario: More Naviagation Controller

**E2E test:** ongoing research

## Prerequisites

- iOS device or simulator

## Note

- On iPad: to display **More** tab - app window size have to correspond to iPhone view.

## Steps

### Baseline

1. Launch the app and navigate to the **More navigation controller** scenario.

- [ ] Expected: Tab bar shows **First**, **Second**, **Third**, **Fourth**, and **More**. The **First** tab is selected. The content area displays `First` as the route key.

---

### More tab — tap interaction

2. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs.

3. Tap **Fifth** in the More screen list.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

4. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates. Route key label reads `Third`.

5. Tap the **More** tab in the tab bar.

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. Tab bar selection updates - More tab is selected.

6. Tap the **More** tab again.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs.

7. Tap **Sixth** in the More screen list.

- [ ] Expected: The **Sixth** tab content is shown. The route key label reads `Sixth`.

---

### Navigation using buttons

8. Tap **"Select Fourth"**.

- [ ] Expected: **Fourth** tab becomes active. Tab bar selection updates. Route key label reads `Fourth`.

9. Tap **"Select Fifth"**.

- [ ] Expected: **Fifth** tab content is shown. Route key label reads `Fifth`. The More tab is selected in the tab bar. No crash or blank screen.

10. From any visible tab (e.g. **First**), tap **"Select Sixth"**.

- [ ] Expected: **Sixth** tab content is shown. Route key label reads `Sixth`. The More tab remains selected in the tab bar.

---

### Selecting More tab directly

11. Tap **Third** tab in the tab bar.

- [ ] Expected: **Third** tab becomes active. Tab bar selection updates. Route key label reads `Third`.

12. Tap **"Select MoreTab"**.

- [ ] Expected: The More screen is opened. The More tab is selected in the tab bar. The native More list is displayed showing **Fifth** and **Sixth**.

---

### Round-trip navigation

13. Tap through tabs in this order using the select buttons: **First** → **Sixth** → **Second** → **Fifth** → **Third** → **More** .

- [ ] Expected: Each transition updates the route key label and tab bar selection correctly. Tabs behind More (Fifth, Sixth, More) show the More tab as selected. No visual glitches or stale route key labels.
