'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

interface NativeProps extends ViewProps {
  leftScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  topScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  rightScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  bottomScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
}

export default codegenNativeComponent<NativeProps>('RNSScrollViewMarker');
