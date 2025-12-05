'use client';

import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

type BottomAccessoryEnvironment = 'regular' | 'inline';

export interface NativeProps extends ViewProps {
  environment?: WithDefault<BottomAccessoryEnvironment, 'regular'>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSBottomTabsAccessoryContent',
  {},
);
