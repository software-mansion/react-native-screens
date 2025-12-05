'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

type BottomAccessoryEnvironment = 'regular' | 'inline';

export interface NativeProps extends ViewProps {
  environment?: CT.WithDefault<BottomAccessoryEnvironment, 'regular'>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSBottomTabsAccessoryContent',
  {},
);
