import type { ViewProps } from 'react-native';
import type { ScrollEdgeEffect } from '../../../types';

export interface ScrollViewMarkerProps {
  children: ViewProps['children'];
  style?: ViewProps['style'];

  scrollEdgeEffects?: {
    bottom?: ScrollEdgeEffect;
    left?: ScrollEdgeEffect;
    right?: ScrollEdgeEffect;
    top?: ScrollEdgeEffect;
  };
}
