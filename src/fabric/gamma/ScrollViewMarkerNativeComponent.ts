'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

interface NativeProps extends ViewProps {
  leftScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  topScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  rightScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  bottomScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSScrollViewMarker');
