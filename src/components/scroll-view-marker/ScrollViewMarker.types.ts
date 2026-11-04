import type { ViewProps } from 'react-native';
import type { ScrollEdgeEffect } from '../shared/types';

export interface ScrollViewMarkerScrollEdgeEffectsIOS {
  bottom?: ScrollEdgeEffect | undefined;
  left?: ScrollEdgeEffect | undefined;
  right?: ScrollEdgeEffect | undefined;
  top?: ScrollEdgeEffect | undefined;
}

export interface ScrollViewMarkerProps {
  children: NonNullable<ViewProps['children']>;
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
