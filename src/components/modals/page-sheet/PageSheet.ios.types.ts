import type { SheetBackgroundEffect } from '../sheet';

/**
 * Material the system renders behind the page sheet's content.
 *
 * @remarks
 * Accepts any {@link SheetBackgroundEffect} value.
 */
export type PageSheetBackgroundEffect = SheetBackgroundEffect;

/**
 * iOS-specific props for {@link PageSheet}.
 */
export interface PageSheetPropsIOS {
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
  backgroundEffect?: PageSheetBackgroundEffect | undefined;
}
