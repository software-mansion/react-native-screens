'use client';

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

type BottomAccessoryEnvironment = 'regular' | 'inline' | 'none';

export interface NativeProps extends ViewProps {
  environment?: WithDefault<BottomAccessoryEnvironment, 'regular'>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSBottomTabsAccessoryContent',
  {},
);
