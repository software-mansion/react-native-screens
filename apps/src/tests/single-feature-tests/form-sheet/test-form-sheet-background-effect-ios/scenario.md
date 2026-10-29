# Test Scenario: Background Effect (iOS)

## Details

**Description:** Verify the `backgroundEffect` property of the `FormSheet` component with detents `[0.35, 0.7, 1.0]`. The host screen lets you pick the material (`automatic`, `none`, `color`, `blur`) with its options (fill color, blur style), and set `nativeContainerStyle.backgroundColor` to see how an opaque container covers the material. The effect can also be changed from inside the presented sheet.

**OS test creation version:** iOS: 26.5 and 27.0.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iPhone: device or simulator running iOS 26.1 or later.
- iPad: device or simulator, app in full-screen mode (regular width and regular height size classes).

## Note

- iOS only. Android ignores the property.
- `backgroundEffect` maps to `UISheetPresentationController.backgroundEffect` (iOS 26.1+). On earlier iOS versions the property is ignored and the system material is used.
- The sheet content has no background of its own; what you see behind the text is the sheet material.
- `none` is a `UIColorEffect` with a `nil` color, which UIKit renders as no material at all: the sheet is transparent and only its content is drawn.

## Steps

### Baseline

1. Launch the app and navigate to the **Background Effect (iOS)** screen.

    - [ ] The host screen shows the striped background, the "effect: automatic" picker, the "container color: none" picker and the "Open FormSheet" button.

---

### `automatic` (default)

1. Tap "Open FormSheet".

    - [ ] The sheet presents at the lowest detent with the system material: Liquid Glass on iOS 26, with the stripes visible through it.

2. Drag the sheet slowly up and down between the two lower detents.

    - [ ] The glass is still presented while being dragged.

3. Drag the sheet all the way up to the top detent (1.0).

    - [ ] Once the sheet gets large, the system material turns opaque: the stripes are no longer visible through it.

4. Swipe the sheet down to dismiss it.

---

### `none`

1. Set "effect" to `none`, tap "Open FormSheet".

    - [ ] The sheet has no material at all: the dimmed stripes show through with no blur or tint, only the grabber and the content are drawn.

2. Swipe the sheet down to dismiss it.

---

### `color`

1. Set "effect" to `color` with "color" `white`, leave "container color" at `none`, tap "Open FormSheet".

    - [ ] The sheet is an opaque white surface.

2. Dismiss. Set "color" to `translucent`, tap "Open FormSheet".

    - [ ] The sheet is a flat magenta-tinted translucent fill, no blur.

3. Dismiss. Set "color" to `navy`.

    - [ ] Opaque navy sheet  with no glass highlight when dragged.

4. Dismiss. Set "container color" to `navy` and "effect" to `automatic`, tap "Open FormSheet".

    - [ ] The sheet looks white from the inside, but dragging it still shows the Liquid Glass highlight; switching "effect" to `color` with `navy` removes it.

---

### `blur`

1. Set "effect" to `blur` and go through all 20 blur styles, reopening each time.

    - [ ] Each style renders the corresponding `UIBlurEffect` material behind the content: the stripes are blurred; `extraLight`, `light`, `regular` and `prominent` are the classic light materials, `dark` is dark; the `system*Material` styles differ in thickness, their `*Light` / `*Dark` variants are fixed to one appearance and the unsuffixed ones follow the color scheme.

---

### Changing the effect while presented

1. Open the sheet with `automatic`, then use the "effect" picker inside the sheet to switch to `color`, `blur` and back.

    - [ ] The material updates in place without the sheet being dismissed or re-presented.
