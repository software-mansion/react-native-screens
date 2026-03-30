import React from 'react';
import ScrollViewMarkerNativeComponent from '../../../fabric/gamma/ScrollViewMarkerNativeComponent';
import type { ScrollViewMarkerProps } from './ScrollViewMarker.types';

export function ScrollViewMarker(props: ScrollViewMarkerProps) {
  const { active, scrollEdgeEffects, ...rest } = props;

  return (
    <ScrollViewMarkerNativeComponent
      active={active}
      leftScrollEdgeEffect={scrollEdgeEffects?.left}
      topScrollEdgeEffect={scrollEdgeEffects?.top}
      rightScrollEdgeEffect={scrollEdgeEffects?.right}
      bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
      {...rest}
    />
  );
}
