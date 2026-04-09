# Test Scenario: More Naviagation Controller

**E2E test:** ongoing research

## Prerequisites

- iOS device or simulator
- 6 tabs are configured (First–Sixth). iOS tab bar displays a maximum of 4 tabs + the built-in **"More"** tab, so Fifth and Sixth are accessible only via the More screen.

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

- [ ] Expected: The **Fifth** tab content is shown. The route key label reads `Fifth`. The More tab remains selected in the tab bar.

6. Tap the **More** tab in the tab bar.

- [ ] Expected: The native More screen opens, listing **Fifth** and **Sixth** as available tabs.

7. Tap **Sixth** in the More screen list.

- [ ] Expected: The **Sixth** tab content is shown. The route key label reads `Sixth`.
