# Test Scenario: Bottom Accessory Size

## Details

**Description:** Verify that the bottom accessory of `TabsHost` takes the full
available width on iPad and iPhone Duo. Pass: every time the accessory gets more
room (sidebar hidden, device rotated, unfolded, tab bar expanded), "Width" goes
back to the full-width value, also when the accessory was hidden or removed
during the change.

**OS test creation version:** iOS 27.0 (iPad), iOS 27.1 (iPhone Duo)

## E2E test

TBD

## Prerequisites

- iPad with iOS 26 or newer: device or simulator, app in full screen, portrait
  orientation at launch.
- iPhone Duo simulator with iOS 27 or newer, closed and in portrait orientation at
  launch.

## Note

- **Known issue:** iPhone Duo, after rotating to landscape with a minimized tab
  bar, the accessory stops short of the tab bar and "Width" is smaller than with
  the tab bar expanded. Native UIKit bug, reported to Apple.

## Steps - iPad

### Baseline

1. Launch the app and navigate to the **Bottom Accessory Size** screen.

   - [ ] The tab bar is at the top of the screen.
   - [ ] The bottom accessory spans the screen width with equal margins on both
         sides and shows "Width:" followed by a number.

### Sidebar

2. Tap the sidebar button.

   - [ ] The sidebar is shown on the leading edge.
   - [ ] The accessory lies next to the sidebar, not under it. "Width" shows a
         smaller number than in step 1.

3. Tap the sidebar button.

   - [ ] The sidebar is hidden and the tab bar is back at the top.
   - [ ] The accessory spans the screen width. "Width" shows the same number as
         in step 1.

### Rotation

4. Rotate the device to landscape.

   - [ ] The accessory spans the screen width with equal margins on both sides.
         "Width" shows a larger number than in step 1.

5. Tap the sidebar button.

   - [ ] The accessory lies next to the sidebar. "Width" shows a smaller number
         than in step 4.

6. Tap the sidebar button.

   - [ ] The sidebar is hidden. "Width" shows the same number as in step 4.

7. Rotate the device to portrait.

   - [ ] The accessory spans the screen width. "Width" shows the same number as
         in step 1.

### Change while hidden

8. Toggle "hidden" on, rotate the device to landscape, then toggle "hidden" off.

   - [ ] The accessory spans the screen width. "Width" shows the same number as
         in step 4.

9. Toggle "rendered" off, rotate the device to portrait, then toggle "rendered"
   on.

   - [ ] The accessory spans the screen width. "Width" shows the same number as
         in step 1.

## Steps - iPhone Duo

### Cover screen

10. With the device closed in portrait, launch the app and navigate to the
    **Bottom Accessory Size** screen.

    - [ ] The tab bar is vertical on the trailing edge.
    - [ ] The accessory lies along the bottom edge next to the tab bar and shows
          "Width:" followed by a number.

11. Rotate the device to landscape.

    - [ ] The tab bar is vertical on the trailing edge.
    - [ ] "Width" shows a larger number than in step 10.

12. Rotate the device to portrait.

    - [ ] "Width" shows the same number as in step 10.

### Unfolding

13. Open the device to half-open.

    - [ ] The tab bar is vertical on the trailing edge.
    - [ ] The accessory lies only on the leading part of the screen and does not
          cross the fold.

14. Open the device fully.

    - [ ] The accessory lies along the bottom edge from the leading edge to the
          tab bar. "Width" shows a larger number than in step 13.

### Rotation when open

15. Rotate the device to portrait.

    - [ ] The tab bar moves to the bottom edge.
    - [ ] The accessory lies centered above the tab bar and is as wide as the
          tab bar.

16. Rotate the device to landscape.

    - [ ] The tab bar is vertical on the trailing edge.
    - [ ] "Width" shows the same number as in step 14.

### Minimized tab bar

17. Rotate the device to portrait, switch to the "Scroll" tab, then scroll down
    one full screen.

    - [ ] The tab bar minimizes and the accessory moves into the same row,
          next to it.
    - [ ] "Width" shows a smaller number than in step 15.

18. Rotate the device to landscape.

    - [ ] The tab bar is vertical on the trailing edge.
    - [ ] The accessory leaves a gap next to the tab bar. "Width" shows a smaller
          number than in step 14 (see Note).

19. Rotate the device to portrait.

    - [ ] The tab bar is at full size at the bottom edge.
    - [ ] "Width" shows the same number as in step 15.

### Change while hidden

20. Switch to the "Config" tab, toggle "hidden" on, rotate the device to
    landscape, then toggle "hidden" off.

    - [ ] "Width" shows the same number as in step 14.

21. Toggle "rendered" off, rotate the device to portrait, then toggle "rendered"
    on.

    - [ ] "Width" shows the same number as in step 15.

### Closing

22. Close the device.

    - [ ] The cover screen shows the app in landscape with the tab bar vertical
          on the trailing edge.
    - [ ] "Width" shows the same number as in step 11.

23. Rotate the device to portrait.

    - [ ] "Width" shows the same number as in step 10.
