# Test Scenario: colorScheme

## Details

**Description:** Verifies the `colorScheme` prop behavior on `StackHost`:
that it takes precedence over the system and React Native appearance
settings, and that the whole header — background, title, subtitle, toolbar
menu, default icons, ripples and the overflow popup — re-themes on every
source path, without losing content scroll position or a fully collapsed
header.

**OS test creation version:** Android: API Level 37.

<!-- TODO: add iOS versions-->

## E2E test

Incomplete: Not automated. Detox does not have access to color attributes
natively, making it impossible to reliably verify if the native header color
has changed in response to a style update.

## Prerequisites

<!--- iOS device/simulator (use Cmd+Shift+A to toggle appearance on the
      simulator)-->

- Android emulator or device, API Level 34 or newer (some icon staleness
  regressions only reproduce on Android 14+).
- System color scheme is switched either from quick settings or via CLI:
  - `adb shell "cmd uimode night yes"`
  - `adb shell "cmd uimode night no"`

## Note

- Color Scheme isn't currently supported on iOS.
- There are three sources of the color scheme, in ascending order of
  precedence: system, React Native `Appearance`, `StackHost` prop. The last
  two are changed with the pickers rendered on every screen of this test.
- An effective color scheme change rebuilds the header natively. The
  following are expected results of that, not bugs:
  - **KI-1 (menu state):** checkbox/radio selections and the results of
    imperative `updateToolbarMenuElements` calls are discarded — the same
    semantics as a `toolbarMenu` prop change. Icons declared in props,
    including already resolved remote ones, survive.
  - **KI-2 (collapse):** a fully collapsed header stays collapsed; any
    other offset resets to expanded. Content scroll position is kept in
    both cases.
- The **trees** icon action item is a bundled photo and is deliberately
  palette-independent — it must look the same in both schemes. It is there
  to show which icons survive a rebuild (KI-1), not to test tinting.
- Section **B** is executed three times, once per color scheme source. The
  remaining sections are executed once, with any source.

## Steps

### A. Precedence

1. Launch the app and navigate to the **Stack Color Scheme** screen.

- [ ] Config screen is shown. Pickers default to `auto` / `inherit` /
      `small`.
- [ ] The header shows the title, subtitle, a **Text** action item, the
      trees icon action item and the overflow button, in the current system
      palette.

2. With StackHost colorScheme = `inherit`, set the React Native picker to
   `light`, then to `dark`.

- [ ] The header follows React Native in both cases — StackHost defers to
      it.

3. Keep React Native = `dark` and set StackHost = `light`. Then set React
   Native = `light` and StackHost = `dark`.

- [ ] The header follows StackHost in both cases — the prop overrides React
      Native and the system.

4. Set StackHost = `inherit`, React Native = `auto`, then toggle the system
   color scheme.

- [ ] The header follows the system.

---

### B. Everything re-themes

Executed with header type `small`. Execute steps 5–9 three times: once
changing the scheme from the system, once with the React Native picker and
once with the StackHost picker, leaving the other two sources at `auto` /
`inherit`.

5. Cycle the scheme light → dark → light with the chosen source, checking
   the header after **each** change.

- [ ] Header background, including the status bar area behind it, and the
      title and subtitle adapt.
- [ ] The **Text** action item label color adapts.
- [ ] The overflow button icon adapts — the return to light is the case that
      catches a stale icon.
- [ ] The trees icon action item looks the same (see Note).
- [ ] No crash, flicker or layout freeze on any change.

6. Press and hold the overflow button.

- [ ] The ripple color matches the current scheme.

7. Open the overflow menu.

- [ ] The popup background, item titles and checkbox marks match the current
      scheme.

8. Tap **Push Details**, then change the color scheme with the same source.

- [ ] The back arrow icon, title, subtitle and background adapt.
- [ ] Pressing and holding the back arrow shows a ripple matching the
      current scheme.

9. Navigate back to **Config**.

- [ ] The Config header already uses the current palette when it shows up —
      no flash of the previous one.

---

### C. Collapsing header

Executed once, with the React Native or StackHost picker — a pin-driven
change is the stricter path. A collapsing header renders its title and
subtitle in four separate slots (expanded and collapsed) and takes its
scrolled color from the content scrim, none of which the `small` header
exercises.

10. Set header type to `medium` and change the color scheme with the header
    **expanded**.

- [ ] The expanded title and subtitle adapt, together with the header
      background.

11. Scroll the content until the header is **fully** collapsed, then change
    the color scheme.

- [ ] The collapsed title and subtitle adapt, together with the scrolled
      background and the status bar area behind it.
- [ ] The header stays fully collapsed and the content scroll position is
      unchanged.

12. Set header type to `large` and repeat step 10.

- [ ] Same result — only the title and subtitle sizes differ from `medium`.

---

### D. Toolbar menu state across a color scheme change

13. In the overflow menu check **Filter B** and select **Sort descending**,
    close the menu, then tap **Load remote icon (imperative)** and wait for
    the trees icon to be replaced by the downloaded image.

- [ ] The **Last selection** line reflects last group selection change and the
      icon action item shows the remote image.

14. Change the color scheme, then open the overflow menu.

- [ ] Selections are back to the initial config — **Filter A**, **Sort
      ascending** (KI-1).
- [ ] The icon action item shows the bundled trees image again — the
      imperative update is discarded while the prop icon survives (KI-1).

---

### E. Keyboard

15. Open the keyboard via the TextInput on the Config screen.
<!--- (or Cmd+K on iOS simulator) -->

<!--- [ ] iOS: Keyboard appearance matches the currently active color scheme
      (verify for both light and dark RN/System values).-->

- [ ] Android: Keyboard appearance matches the system color scheme,
      regardless of the React Native and StackHost values — the header's
      color scheme does not affect it.
