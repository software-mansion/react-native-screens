# Back button visibility

1. Set `backButtonHidden` to false on Root. Root must still have no back button.
2. Push Visibility. Its initial `backButtonHidden: true` must hide the back button while keeping the header title visible.
3. Set false. The native back button must appear. Set true to hide it again.
4. Remove the prop while true. The back button must reappear.
5. Set true and push Default. Default must have a back button. Pop Default and check that Visibility still hides its back button.
6. Remove the header config while true. The navigation bar must hide. Push Default, then pop it. Visibility must still have no header.
7. Remove the prop, then mount the header config. Visibility's native back button must appear.
8. Pop Visibility. Root must have no back button. Push Visibility again and check its initial hidden state.

Repeat on iOS 18 and iOS 26. This test uses the existing shared `backButtonHidden` prop, not back-button title/display-mode options.
