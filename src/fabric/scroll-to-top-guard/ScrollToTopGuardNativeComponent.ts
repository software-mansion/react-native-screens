'use client';

import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>('RNSScrollToTopGuard', {
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
