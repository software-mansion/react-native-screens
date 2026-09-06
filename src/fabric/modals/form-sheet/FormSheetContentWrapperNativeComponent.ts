'use client';

import type { HostComponent, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  'RNSFormSheetContentWrapper',
) as HostComponent<NativeProps>;
