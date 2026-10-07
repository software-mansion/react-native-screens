# Test Scenario: tabBarSidebarPreferredPlacement

## Details

**Description:** Validates that `tabBarSidebarPreferredPlacement` selects
between the sidebar and the tab bar when only one of them can be displayed
(iPhone with a regular horizontal size class). Each tab hosts a Stack v5 with
a native header (with leading and trailing header items) and a "Details" screen
that can be pushed, to verify the sidebar button in the header, the back button
and the content layout next to the sidebar.

**OS test creation version:** iOS 27.0

## E2E test

**TBD:** Requires a regular horizontal size class on iPhone (landscape on
Plus/Max models), which is not currently automated.

## Prerequisites

- iOS 27+ simulator or device: Plus/Max iPhone and iPad.

## Note

The sidebar is available only when `tabBarControllerMode` is `tabSidebar`.
With `automatic`, the tab bar is always displayed, regardless of
`tabBarSidebarPreferredPlacement`.

## Steps

### iPhone (Plus/Max)

1. Launch the app in portrait orientation and navigate to the **Tab Bar Sidebar Preferred Placement** screen.

    - [ ] Bottom tab bar with Tab1, Tab2, Tab3. Both pickers default to `automatic`.
    - [ ] Header shows the tab title with two leading and two trailing header items.

2. Set tabBarSidebarPreferredPlacement = `sidebar` (keep tabBarControllerMode = `automatic`).

    - [ ] Tabs are still displayed as a bottom tab bar.

3. Set tabBarControllerMode = `tabSidebar`.

    - [ ] Tabs are still displayed as a bottom tab bar (compact width in portrait).

4. Rotate the device to landscape.

    - [ ] Tabs are displayed as a sidebar.
    - [ ] Header and pickers start next to the sidebar. The content is resized and displayed only on the right side. The sidebar does not overlap it.

5. Hide the sidebar using the button at the top of the sidebar.

    - [ ] Sidebar is hidden, no bottom tab bar is displayed.
    - [ ] A sidebar button appears on the leading side of the header.
    - [ ] Content spans the full width (within the safe area).

6. Show the sidebar using the sidebar button in the header.

    - [ ] Sidebar is displayed again and the content starts next to it.

7. Hide the sidebar again, then swipe from the leading edge of the screen.

    - [ ] Sidebar is displayed over the content (the content is not moved and stays underneath the sidebar).
    - [ ] The content is not accessible until the sidebar is hidden.

8. Hide the sidebar.

    - [ ] After hiding the sidebar, the content is accessible again.

9. Tap each header item (leading and trailing).

    - [ ] Each item responds to the tap and toggles its size (small square / wider rectangle).
    - [ ] Items stay laid out in the header and do not overlap the title or the sidebar button.

10. Tap **Push screen**.

    - [ ] "Details" screen is pushed with a back button and the same header items.
    - [ ] **Pop screen** and the back button return to the previous screen.

11. Set tabBarSidebarPreferredPlacement = `tabBar`.

    - [ ] Tabs are displayed as a bottom tab bar.

12. Set tabBarSidebarPreferredPlacement = `sidebar` and rotate to portrait.

    - [ ] Tabs are displayed as a bottom tab bar (compact width).

13. Rotate back to landscape.

    - [ ] Tabs are displayed as a sidebar again.
