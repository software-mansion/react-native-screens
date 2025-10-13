'use client';

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenNavigationContainer',
  {},
);
