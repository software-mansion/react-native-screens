import type { ViewProps } from 'react-native';
import type { ScrollEdgeEffect } from '../../shared/types';

export interface ScrollViewMarkerProps {
  children: ViewProps['children'];
  style?: ViewProps['style'] | undefined;

  scrollEdgeEffects?:
    | {
        bottom?: ScrollEdgeEffect | undefined;
        left?: ScrollEdgeEffect | undefined;
        right?: ScrollEdgeEffect | undefined;
        top?: ScrollEdgeEffect | undefined;
      }
    | undefined;
}
