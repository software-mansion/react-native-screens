import type { ScrollEdgeEffect } from '../shared/types';

/**
 * Effect applied to the scrolling content at an edge of the scroll view
 * marked by {@link ScrollViewMarker}.
 *
 * @remarks
 * Accepts any {@link ScrollEdgeEffect} value.
 */
export type ScrollViewMarkerScrollEdgeEffect = ScrollEdgeEffect;

/**
 * Scroll edge effects of a scroll view, set for each edge separately.
 */
export interface ScrollViewMarkerScrollEdgeEffectsIOS {
  /**
   * Scroll edge effect at the bottom edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26
   */
  bottom?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the left edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26
   */
  left?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the right edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26
   */
  right?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the top edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26
   */
  top?: ScrollViewMarkerScrollEdgeEffect | undefined;
}

/**
 * iOS-specific props for {@link ScrollViewMarker}.
 */
export interface ScrollViewMarkerPropsIOS {
  /**
   * Configures the scroll edge effect for the _content ScrollView_ (the
   * ScrollView resolved in direct subtree of the ScrollViewMarker).
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect | UIScrollEdgeEffect}
   * @platform ios >= 26
   */
  scrollEdgeEffects?: ScrollViewMarkerScrollEdgeEffectsIOS | undefined;
}
