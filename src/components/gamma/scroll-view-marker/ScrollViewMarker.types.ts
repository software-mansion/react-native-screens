import type { ViewProps } from 'react-native';
import type { ScrollEdgeEffect } from '../../shared/types';

export interface ScrollViewMarkerProps {
  active?: boolean;
  children: ViewProps['children'];
  style?: ViewProps['style'];

  scrollEdgeEffects?: {
    bottom?: ScrollEdgeEffect;
    left?: ScrollEdgeEffect;
    right?: ScrollEdgeEffect;
    top?: ScrollEdgeEffect;
  };
}
