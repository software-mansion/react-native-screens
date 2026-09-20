# Navigation item style

1. Push Document. Its initial editor style should use a chevron-only back button and UIKit's editor title layout.
2. Select navigator, browser, and editor. Compare UIKit's title alignment and back-button presentation. Navigator centers the title. In regular-width iPad layouts, browser and editor place it at the leading edge. UIKit adapts title placement to the current OS, device, and available space.
3. Select editor, then remove the style. Document must return to the default navigator style.
4. Select editor and push Default. Default must use navigator style. Pop it and check that Document still uses editor style.
5. Remove the header config. Push Default, then pop it. Document must still have no header.
6. Remove the style and mount the header config. Document must use navigator style.
7. Pop Document, then push a new instance. Its initial style must be editor again.

8. Omit the title. Switch between navigator and editor and check the back-button presentation. Add a custom title, switch through all styles, then remove the style. The custom title must return to navigator placement.

Repeat on iPhone and iPad, including iOS 18 and iOS 26. The option is ignored before iOS 16 and on Android/tvOS.
