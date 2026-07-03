import React from 'react';
import ScrollViewMarkerNativeComponent from '../../../fabric/gamma/ScrollViewMarkerNativeComponent';
import { hasExplicitScrollEdgeEffects } from '../../helpers/scrollEdgeEffects';
import type { ScrollViewMarkerProps } from './ScrollViewMarker.types';

export function ScrollViewMarker(props: ScrollViewMarkerProps) {
  const { scrollEdgeEffects, ...rest } = props;
  const hasScrollEdgeEffects =
    hasExplicitScrollEdgeEffects(scrollEdgeEffects);

  return (
    <ScrollViewMarkerNativeComponent
      leftScrollEdgeEffect={scrollEdgeEffects?.left}
      topScrollEdgeEffect={scrollEdgeEffects?.top}
      rightScrollEdgeEffect={scrollEdgeEffects?.right}
      bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
      hasScrollEdgeEffects={hasScrollEdgeEffects}
      {...rest}
    />
  );
}
