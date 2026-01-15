'use client';

import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';

interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenNavigationContainer',
  {},
);
