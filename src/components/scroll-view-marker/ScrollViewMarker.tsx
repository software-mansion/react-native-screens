import React from 'react';
import ScrollViewMarkerNativeComponent from '../../fabric/ScrollViewMarkerNativeComponent';
import type { ScrollViewMarkerProps } from './ScrollViewMarker.types';

/**
 * Marks the scroll view it wraps as the content scroll view of the nearest
 * native screen.
 *
 * @warning
 * When the marker does not find a scroll view among its children, the app
 * crashes on Android, and an assertion fails in debug builds on iOS.
 *
 * @platform android, ios
 */
export function ScrollViewMarker(props: ScrollViewMarkerProps) {
  const { scrollEdgeEffects, ...rest } = props;

  return (
    <ScrollViewMarkerNativeComponent
      leftScrollEdgeEffect={scrollEdgeEffects?.left}
      topScrollEdgeEffect={scrollEdgeEffects?.top}
      rightScrollEdgeEffect={scrollEdgeEffects?.right}
      bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
      {...rest}
    />
  );
}
