import type { ViewProps } from 'react-native';

export interface ScrollEdgeElementProps extends ViewProps {
  /**
   * The edge of the scroll view that the wrapped views overlay.
   *
   * The scroll view is the one wrapped by the nearest `ScrollViewMarker` in the
   * same screen: an ancestor marker, or else the first marker found in the
   * subtree of the closest ancestor that contains one. The search does not
   * leave the enclosing view controller's view. Without a marker, the
   * component has no effect.
   *
   * The whole bounds of this view shape the edge effect, so it should span
   * from the scroll view's edge to the far side of the wrapped views, as a
   * bar would. The edge effect style comes from the marker's
   * `scrollEdgeEffects` for the same edge.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeelementcontainerinteraction|UIScrollEdgeElementContainerInteraction}
   *
   * @default `bottom`
   *
   * @platform ios
   *
   * @supported iOS 26 or higher
   */
  edge?: 'top' | 'bottom' | undefined;
}
