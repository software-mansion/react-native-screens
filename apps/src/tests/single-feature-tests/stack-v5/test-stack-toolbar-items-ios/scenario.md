# Stack Toolbar Items (iOS)

Run on iPhone and iPad, with iOS 18 and iOS 26 or later.

1. Observe Unread, First toolbar, and Actions in the bottom toolbar, in that order.
2. Tap Unread. Both the item and the Filter status change to All. No keyboard appears.
3. Open Actions, select Archive, and observe Action: Archive.
4. Toggle fixed width. The gap between the first two items grows, then resets.
5. Toggle custom item, tap Custom, and observe Action: Custom. Toggle it off.
6. Push other toolbar. Second replaces First. Go back and observe the First toolbar restored.
7. Push plain screen. The toolbar disappears. Go back and observe the First toolbar restored.
8. Try Empty items and Omit items, restoring after each. The toolbar disappears and returns.
9. Toggle header config off and on. The toolbar clears and returns with the new config.
10. Toggle header visibility. The toolbar remains visible with the navigation bar hidden.
11. Repeat navigation using the native back button and an interactive back gesture, including cancellation.

Android and tvOS ignore `ios.toolbarItems`. This scenario does not attach a SearchBar.

The automated cancelled/completed gesture case runs on iOS 26 or later. The same swipe does not complete on unchanged main on iOS 18, so older-runtime interactive gesture verification remains manual. Native back-button and programmatic navigation are covered on both versions.
