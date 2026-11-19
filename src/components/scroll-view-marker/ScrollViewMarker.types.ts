import type { ViewProps } from 'react-native';
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
   */
  bottom?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the left edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   */
  left?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the right edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   */
  right?: ScrollViewMarkerScrollEdgeEffect | undefined;
  /**
   * Scroll edge effect at the top edge of the scroll view.
   *
   * @defaultValue `'automatic'`
   */
  top?: ScrollViewMarkerScrollEdgeEffect | undefined;
}

/**
 * Props for {@link ScrollViewMarker}.
 */
export interface ScrollViewMarkerProps {
  /**
   * Content of the marker, with the scroll view to mark as its child.
   *
   * @remarks
   * The scroll view must be the only direct child of the marker.
   *
   * @note
   * This is an implementation detail and may change. On Android, only a
   * vertical scroll view is found.
   *
   * @platform android, ios
   */
  children: NonNullable<ViewProps['children']>;
  /**
   * Style of the marker's own view.
   *
   * @platform android, ios
   */
  style?: ViewProps['style'] | undefined;

  /**
   * Configures the scroll edge effect for the _content ScrollView_ (the
   * ScrollView resolved in direct subtree of the ScrollViewMarker).
   *
   * @defaultValue `'automatic'` for each edge.
   * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect | UIScrollEdgeEffect}
   * @platform ios >= 26
   */
  scrollEdgeEffects?: ScrollViewMarkerScrollEdgeEffectsIOS | undefined;
}
