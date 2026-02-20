import React from 'react';
import ScrollViewMarkerNativeComponent from '../../../fabric/gamma/ScrollViewMarkerNativeComponent';
import type { ScrollViewMarkerProps } from './ScrollViewMarker.types';

export function ScrollViewMarker(props: ScrollViewMarkerProps) {
  return <ScrollViewMarkerNativeComponent {...props} />;
}
