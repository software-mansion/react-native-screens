import type { SheetBackgroundEffect } from '../sheet';

/**
 * Material the system renders behind the form sheet's content.
 *
 * @remarks
 * Accepts any {@link SheetBackgroundEffect} value.
 */
export type FormSheetBackgroundEffect = SheetBackgroundEffect;

/**
 * iOS-specific props for {@link FormSheet}.
 */
export interface FormSheetPropsIOS {
  /**
   * Material the system renders behind the sheet's content.
   *
   * @remarks
   * The material is drawn behind the native container, so an opaque
   * `nativeContainerStyle.backgroundColor` covers it.
   *
   * @defaultValue `'automatic'`
   * @see {@link https://developer.apple.com/documentation/uikit/uipresentationcontroller/backgroundeffect | UIPresentationController.backgroundEffect}
   * @platform ios >= 26.1
   */
  backgroundEffect?: FormSheetBackgroundEffect | undefined;
}
