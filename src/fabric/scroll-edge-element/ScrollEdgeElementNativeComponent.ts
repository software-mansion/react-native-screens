'use client';

import type {
  CodegenTypes as CT,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

type ScrollEdge = 'top' | 'bottom';

export interface NativeProps extends ViewProps {
  edge?: CT.WithDefault<ScrollEdge, 'bottom'>;
}

export default codegenNativeComponent<NativeProps>('RNSScrollEdgeElement', {
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
