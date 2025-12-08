# FormSheet - Handling Flex in FormSheet's Content

## Problem

Currently, the `RNSScreenContentWrapper` (the view that adapts to the size of FormSheet's content) does not allow for defining styles that depend on the sheet's detents. This is because those styles would need to be applied to the parent view - `RNSModalScreen`.

![Main layout](form-sheet-flex-assets/content-wrapper-main.png "ScreenContentWrapper layout on the main branch")

Preventing `RNSScreenContentWrapper` from resizing to match its parent was initially necessary due to the lack of synchronous updates in React Native. During transitions between detents, the size of `RNSModalScreen` is updated **asynchronously** in the Shadow Tree. This leads to a mismatch with the current native state and causes the content to flicker, as shown in the video:

<video controls width="100%">
  <source src="form-sheet-flex-assets/jumping-content.mp4" type="video/mp4">
</video>

These styles are controlled by `ScreenStackItem`:  
https://github.com/software-mansion/react-native-screens/blob/338df214aeafbfa01252ffc0aa8fa97728100a1f/src/components/ScreenStackItem.tsx#L216-L218

By disabling child resizing to the parent, the children of `RNSScreenContentWrapper` lose a frame of `RNSModalScreen` as a reference. Setting `flex: 1` does not work since there is no defined height of the parent container.

One solution would be to make `RNSScreen` the reference point - having a **synchronous** update of the layout state in Yoga. This would allow components using `flex: 1` to correctly adapt to the `RNSScreen` size immediately.

![With flex support](form-sheet-flex-assets/content-wrapper-flex-allowed.png "ScreenContentWrapper layout with flex support")

**This implementation becomes possible in React Native 0.82+, but the significant drawback, which is the inconsistency across platforms, remains.**

## Platform Differences

On Android, the FormSheet follows a different implementation model. Unlike on iOS, it knows its maximum dimensions using:

- Defined `sheetDetents`
- Our knowledge about the renderable space.

Because Android also lacks synchronous state updates, the following approach was chosen:

- The FormSheet always renders at its **maximum size**.
- **Only a portion of that size is shown** based on the active detent.
- The transition between detents is handled using **`translateY`**.

On the other hand, on iOS:

- The FormSheet's **size dynamically adapts** based on the current detent.
- Components aligned to the bottom of the FormSheet are **tightened to the bottom edge**.
- The transition is handled via changing the **`height`** of the sheet.

| Platform | Minimal Detent | Maximal Detent |
|----------|----------------|----------------|
| Android  | ![Android min](form-sheet-flex-assets/android-min-detent.png "Android min detent") | ![Android max](form-sheet-flex-assets/android-max-detent.png "Android max detent") |
| iOS      | ![iOS min](form-sheet-flex-assets/ios-min-detent.png "iOS min detent")           | ![iOS max](form-sheet-flex-assets/ios-max-detent.png "iOS max detent")             |

These platform differences create challenges for implementing consistent cross-platform behavior, particularly when using layout styles like `flex: 1`.

## Potential Solution

Adding support for `flex: 1` on iOS is possible, but it results in completely different styling behavior. Currently, there is also inconsistency - the component behaves correctly on Android, but not on iOS. Therefore, we believe a smaller issue is dealing with styling differences across platforms rather than losing complete functionality on one of them.

However, there are certain technical limitations that make implementing a unified solution difficult:

- Due to the lack of synchronous ShadowNode state updates on Android, we cannot replicate the iOS model (which involves changing the component's height dynamically) without causing content to flicker.
- On iOS, we cannot reliably determine the large detent value based on the medium detent. These values are defined by the system. Starting from iOS 16, Apple provides an API revealing these values, but we must still support iOS 15, which does not give us access to that data.

**Once we decide to drop support for iOS 15, we could potentially migrate the current iOS implementation to use the Android-like fixed-height FormSheet model.**

Until then, supporting styling with `flex: 1` may cause visual inconsistencies. These are documented below in table format:

---

### 1. FormSheet with Detents, Content Styled with Flex

Difference:
- On Android, the "End" text becomes visible only when expanded to the maximum detent.
- On iOS, the "End" text is always visible.

| Platform | Android | iOS |
|----------|---------|-----|
| Minimal Detent | ![Android min](form-sheet-flex-assets/1-min-android.png "Android min detent") | ![iOS min](form-sheet-flex-assets/1-min-ios.png "iOS min detent") |
| Maximal Detent | ![Android max](form-sheet-flex-assets/1-max-android.png "Android max detent") | ![iOS max](form-sheet-flex-assets/1-max-ios.png "iOS max detent") |

---

### 2. FormSheet with Detents, Content Styled with maxHeight

Difference:
- No visual differences observed - works consistently across both platforms.

| Platform | Android | iOS |
|----------|---------|-----|
| Minimal Detent | ![Android min](form-sheet-flex-assets/2-min-android.png "Android min detent") | ![iOS min](form-sheet-flex-assets/2-min-ios.png "iOS min detent") |
| Maximal Detent | ![Android max](form-sheet-flex-assets/2-max-android.png "Android max detent") | ![iOS max](form-sheet-flex-assets/2-max-ios.png "iOS max detent") |

---

### 3. FormSheet with fitToContents, Content Styled with Flex

Difference:
- Android does not support `fitToContents` when using `flex` - we do not support this use case. 
- On iOS, it works by coincidence.
- `fitToContents` requires knowing the content height, which is not possible when using flex.

| Platform | Android | iOS |
|----------|---------|-----|
| Fit To Contents | ![Android](form-sheet-flex-assets/3-android.png "Android fitToContents (not supported)") | ![iOS](form-sheet-flex-assets/3-ios.png "iOS fitToContents") |

---

### 4. FormSheet with fitToContents, Content Styled with maxHeight

Difference:
- iOS automatically respects the bottom inset of the navigation bar. 
- On Android, this must be handled manually by wrapping the component with `SafeAreaView`.

| Platform | Android | iOS |
|----------|---------|-----|
| Fit To Contents | ![Android](form-sheet-flex-assets/4-android.png "Android fitToContents") | ![iOS](form-sheet-flex-assets/4-ios.png "iOS fitToContents") |
