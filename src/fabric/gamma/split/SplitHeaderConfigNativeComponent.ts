'use client';

import type { ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

export interface NativeProps extends ViewProps {
  title?: string;
  hidden?: boolean;
  largeTitle?: boolean;
}

export default codegenNativeComponent<NativeProps>('RNSSplitHeaderConfig', {
  interfaceOnly: true,
});
