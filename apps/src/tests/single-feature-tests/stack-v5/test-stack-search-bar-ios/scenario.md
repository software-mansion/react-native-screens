# Search bar in a Stack v5 header

Run this standalone scenario or open Single feature tests > Stack v5 > Search bar (iOS). Status rows show the last received event payloads.

1. The Home header shows a stacked search field without focusing it. Open Filters and select Apply filter. The filter count increases; search stays unfocused and the keyboard stays hidden.
2. Focus search using the button. Type text, submit with the keyboard Search button, and verify focus, text and submission events. Blur search, then focus again and cancel. Verify blur/cancel events and that cancel clears text.
3. Use Set text and Clear text and inspect the native field. These commands do not emit a change event. Show/hide cancel button use the existing SearchBar command behavior.
4. Focus search, then Replace search. The old search closes and a new empty field appears with an incremented placeholder. Remove search while focused, mount it again, and verify it starts unfocused. Repeat with Remove header and Mount header.
5. Toggle Hide when scrolling without changing any HeaderConfig property, then scroll the results. Toggle Placement and check UIKit updates the field placement. On iOS 26 automatic placement may integrate into UIKit's toolbar; this scenario does not configure toolbar items.
6. Focus and type in Home, push a screen without search, then pop. The destination has no search field or keyboard. Home returns unfocused after UIKit dismisses the active search. Set text while Home is unfocused, then push another search screen and type distinct text there. Popping must restore Home's inactive field and its text without automatically focusing it.
7. Repeat on iOS 18 and iOS 26. Android/web/tvOS do not support this iOS header option.
