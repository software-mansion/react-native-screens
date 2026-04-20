import type { ViewProps } from 'react-native';
import type { ScrollEdgeEffect } from '../../shared/types';

export interface ScrollViewMarkerProps {
  children: NonNullable<ViewProps['children']>;
  style?: ViewProps['style'] | undefined;

  /**
   * Configures the scroll edge effect for the _content ScrollView_ (the ScrollView resolved in direct subtree of the ScrollViewMarker).
   * Depending on values set, it will blur the scrolling content below certain UI elements (header items, search bar)
   * for the specified edge of the ScrollView.
   *
   * When set in nested containers, i.e. Stack inside Tabs, or the other way around,
   * the ScrollView will use only the innermost one's config.
   *
   * Edge effects can be configured for each edge separately. The following values are currently supported:
   *
   * - `automatic` - the automatic scroll edge effect style,
   * - `hard` - a scroll edge effect with a hard cutoff and dividing line,
   * - `soft` - a soft-edged scroll edge effect,
   * - `hidden` - no scroll edge effect.
   *
   * The supported values correspond to the `UIScrollEdgeEffect`'s `style` and `isHidden` props
   * in the official UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect|UIScrollEdgeEffect}
   *
   * @default `automatic` for each edge
   *
   * @platform ios
   *
   * @supported iOS 26 or higher
   */
  scrollEdgeEffects?:
    | {
        bottom?: ScrollEdgeEffect | undefined;
        left?: ScrollEdgeEffect | undefined;
        right?: ScrollEdgeEffect | undefined;
        top?: ScrollEdgeEffect | undefined;
      }
    | undefined;
}
