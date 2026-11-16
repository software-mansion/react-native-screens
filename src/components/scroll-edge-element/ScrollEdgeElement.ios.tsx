'use client';

import React from 'react';
import ScrollEdgeElementNativeComponent from '../../fabric/scroll-edge-element/ScrollEdgeElementNativeComponent';
import type { ScrollEdgeElementProps } from './ScrollEdgeElement.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * Wraps views that float over an edge of a `ScrollViewMarker`'s scroll view,
 * such as a custom footer, toolbar or header, so that on iOS 26+ the scroll
 * view draws its scroll edge effect under them, as it does under system bars.
 *
 * Renders a plain `View` on other platforms and on iOS versions below 26.
 */
export function ScrollEdgeElement(props: ScrollEdgeElementProps) {
  return <ScrollEdgeElementNativeComponent {...props} collapsable={false} />;
}
