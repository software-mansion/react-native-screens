import type { ViewProps } from 'react-native';
import type { ScrollViewMarkerPropsIOS } from './ScrollViewMarker.ios.types';

/**
 * Cross-platform props for {@link ScrollViewMarker}.
 */
export interface ScrollViewMarkerPropsBase {
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
}

/**
 * Props for {@link ScrollViewMarker}.
 */
export interface ScrollViewMarkerProps extends ScrollViewMarkerPropsBase {
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: ScrollViewMarkerPropsIOS | undefined;
}
